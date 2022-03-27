const {google} = require('googleapis');
const youtubeClientId = process.env.YOUTUBE_CLIENT_ID;
const youtubeClientSecret = process.env.YOUTUBE_CLIENT_SECRET;

console.log(youtubeClientId)
console.log(youtubeClientSecret)

if (process.env.DEV) {
  var redirectURI = 'https://127.0.0.1:3000/dashboard'

} else {
  var redirectURI = 'https://d33jcvm0fuhn35.cloudfront.net/dashboard' //may need an extra slash at the end
}

const oauth2Client = new google.auth.OAuth2(
  youtubeClientId,
  youtubeClientSecret,
  redirectURI //maybe dont need?
);




const service = google.youtube('v3');

exports.login = async function (email) {
  try {
    // console.log('In YouTube Login Service');
      
      const scopes = [
        'https://www.googleapis.com/auth/youtube.readonly',
      ];

      const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
      });

    return {link: url}
  } catch (err) {
    console.log(err);
    console.log('big error catch');
    return err;
  }
};

exports.convert = async function (req, res) {
  try {
    // console.log('In YouTube Convert Service');
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
    // console.log('In YouTube Activity Service');
    const result = await service.activities.list({
      auth: oauth2Client,
      part: 'snippet,contentDetails',
      mine: true,
      maxResults: 25
    });
    return result.data;
  } catch (err) {
    console.log('big error catch');
    console.log(err)
    return err;
  }
};

exports.likedVideos = async function (req, res) {
  try {
    console.log('In YouTube video list Service');
    const result = await service.videos.list({
      auth: oauth2Client,
      part: 'snippet,contentDetails,statistics',
      myRating: 'like'
      // maxResults: 50
    });
    return result.data;
  } catch (err) {
    console.log('big error catch');
    console.log(err)
    return err;
  }
};

exports.subscriptions = async function (req, res) {
  try {
    // console.log('In YouTube Subscriptions Service');
    const result = await service.subscriptions.list({
      auth: oauth2Client,
      part: 'snippet,contentDetails',
      mine: true,
      maxResults: 50
    });
    return result.data;
  } catch (err) {
    console.log('big error catch');
    console.log(err)
    return err;
  }
};