require("dotenv").config();
const express = require("express");
const request = require("request");
const cors = require("express");
const queryStirng = require("query-string");
const bodyParser = require("body-parser");
const axios = require("axios");
const cookieParser = require("cookie-parser");

const app = express();

app
  .use(cors())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(cookieParser());

const { PORT = 3000, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;
const stateKey = "spotify_auth_state";
const BASE_API = "https://accounts.spotify.com";
const access_token = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
  "base64"
);
console.log("access_token", access_token);
app.get("/", (_req, res) => res.send("Service Available!"));

app.get("/login", async (_req, res) => {
  const state = "34fFs29kd09";
  const scope = "user-read-private user-read-email";

  res.cookie(stateKey, state);
  res.redirect(
    `${BASE_API}/authorize?${queryStirng.stringify({
      response_type: "code",
      client_id: CLIENT_ID,
      scope,
      redirect_uri: REDIRECT_URI,
      state,
    })}`
  );
});

app.get("/callback", async (req, res) => {
  try {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState)
      return res.redirect(
        `/#${queryStirng.stringify({ error: "state_mismatch" })}`
      );

    res.clearCookie(stateKey);

    const authOptions = {
      url: `${BASE_API}/api/token`,
      form: {
        code,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization: `Basic ${access_token}`,
      },
      json: true,
    };

    request.post(authOptions, async (error, response, body) => {
      let access_token, refresh_token;
      if (!error && response.statusCode === 200) {
        access_token = body.access_token;
        refresh_token = body.refresh_token;
      }

      const { data } = await axios({
        method: "GET",
        headers: {
          authorization: `Bearer ${access_token}`,
        },
        url: "https://api.spotify.com/v1/me",
      });

      res.send(data);
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => console.log(`Service listening on port ${PORT}`));
