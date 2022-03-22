// import { gapi, loadAuth2, loadAuth2WithProps, loadClientAuth2 } from 'gapi-script';
// const gapi = require('gapi-script');
const {google} = require('googleapis');
const path = require('path');
const config = require(path.resolve(__dirname, '../config.json'));
const User = require(path.resolve(__dirname, '../database/models/user'));

exports.login = async function (email) {
  try {
    console.log('In Login');
    // const result = await gapi.auth2.getAuthInstance()
    // .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})

    const oauth2Client = new google.auth.OAuth2(
        config.youtubeClientId,
        config.youtubeClientSecret,
        'https://localhost:3000/dashboard' //maybe dont need?
      );
      
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
    return {link: url}
    // return { link: link, verificationString: email };
  } catch (err) {
    console.log(err);
    console.log('big error catch');
    return err;
  }
};