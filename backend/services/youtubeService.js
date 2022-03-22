const {google} = require('googleapis');
const path = require('path');
const youtubeClientId = process.env.YOUTUBE_CLIENT_ID;
const youtubeClientSecret = process.env.YOUTUBE_CLIENT_SECRET;

const User = require('../database/models/User');

const oauth2Client = new google.auth.OAuth2(
  youtubeClientId,
  youtubeClientSecret,
  'https://localhost:3000/dashboard' //maybe dont need?
);

const service = google.youtube('v3');

exports.login = async function (email) {
  try {
      
      const scopes = [
        'https://www.googleapis.com/auth/youtube.readonly',
      ];

      const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
      });

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

    const {tokens} = await oauth2Client.getToken(decodeURIComponent(code))

    oauth2Client.setCredentials(tokens);


    return tokens; //perhaps unnecessary given it is stored in the backend client?
  } catch (err) {
    console.log('big error catch');
    console.log(err)
    return err;
  }
};

exports.activity = async function (req, res) {
  try {
    const result = await service.activities.list({
      auth: oauth2Client,
      part: 'snippet,contentDetails',
      mine: true,
      maxResults: 25
    });
    return result.data;
  } catch (err) {
    console.log('big error catch');
    // console.log(err)
    return err;
  }
};

exports.subscriptions = async function (req, res) {
  try {
    const result = await service.subscriptions.list({
      auth: oauth2Client,
      part: 'snippet,contentDetails',
      mine: true,
    });
    return result.data;
  } catch (err) {
    console.log('big error catch');
    // console.log(err)
    return err;
  }
};