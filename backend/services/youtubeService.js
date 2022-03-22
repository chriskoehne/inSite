// import { gapi, loadAuth2, loadAuth2WithProps, loadClientAuth2 } from 'gapi-script';
// const gapi = require('gapi-script');
const {google} = require('googleapis');
const path = require('path');
const config = require(path.resolve(__dirname, '../config.json'));
const User = require(path.resolve(__dirname, '../database/models/user'));

const oauth2Client = new google.auth.OAuth2(
  config.youtubeClientId,
  config.youtubeClientSecret,
  'https://localhost:3000/dashboard' //maybe dont need?
);

const service = google.youtube('v3');

exports.login = async function (email) {
  try {
    console.log('In Login');
    // const result = await gapi.auth2.getAuthInstance()
    // .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
      
      const scopes = [
        'https://www.googleapis.com/auth/youtube.readonly',
      ];

      const url = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',
      
        // If you only need one scope you can pass it as a string
        scope: scopes
      });
    // console.log("in service,")
    // console.log(oauth2Client)
    console.log("whats the url")
    console.log(url)

    return {link: url}
    // return { link: link, verificationString: email };
  } catch (err) {
    console.log(err);
    console.log('big error catch');
    return err;
  }
};

exports.convert = async function (req, res) {
  try {
    console.log(req.body);
    const code = req.body.code;

    // console.log("in convert")
    // console.log(oauth2Client)
    // console.log(code)

    const {tokens} = await oauth2Client.getToken(decodeURIComponent(code))

    // console.log("in convert service,")
    // console.log(tokens)

    oauth2Client.setCredentials(tokens);

    // console.log("in convert service")
    // console.log(tokens)

    return tokens; //perhaps unnecessary given it is stored in the backend client?
  } catch (err) {
    console.log('big error catch');
    console.log(err)
    return err;
  }
};

exports.activity = async function (req, res) {
  try {
    console.log(req.body);
    // oauth2Client is auth for service
    const result = await service.activities.list({
      auth: oauth2Client,
      part: 'snippet,contentDetails',
      mine: true,
      maxResults: 25
    });
    console.log("in service, activity is")
    console.log(result)
    return result.data;
  } catch (err) {
    console.log('big error catch');
    // console.log(err)
    return err;
  }
};

exports.subscriptions = async function (req, res) {
  try {
    console.log(req.body);
    // oauth2Client is auth for service
    const result = await service.subscriptions.list({
      auth: oauth2Client,
      part: 'snippet,contentDetails',
      mine: true,
    });
    console.log("in service, subscrptions is")
    console.log(result)
    return result.data;
  } catch (err) {
    console.log('big error catch');
    // console.log(err)
    return err;
  }
};