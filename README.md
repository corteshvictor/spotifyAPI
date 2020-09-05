# Spotify API - Code Samples

### Setup A Spotify API in NodeJS - OAuth 2.0

- Login Dashboard - https://developer.spotify.com/dashboard/
- Create an App. Add Name, Description and accept the terms - https://developer.spotify.com/dashboard/applications
- Enter your app and edit the settings.
  - add the url of your website. For example http://localhost:3000
  - add Redirect URIs. For example http://localhost:3000/callback
- Add in the environment your client id and Secret

Read more

- [App Settings](https://developer.spotify.com/documentation/general/guides/app-settings/)
- [Authorization Guide](https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow)
- [Web API](https://developer.spotify.com/documentation/web-api/)

## .env

```
PORT
CLIENT_ID
CLIENT_SECRET
REDIRECT_URI=[The same one you put in your configuration]
```
