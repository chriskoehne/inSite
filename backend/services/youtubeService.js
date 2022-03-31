const {google} = require('googleapis');
const { isAsyncFunction } = require('util/types');
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
      myRating: 'like',
       //maxResults: 2
    });
    return result.data;
  } catch (err) {
    console.log('big error catch');
    console.log(err)
    return err;
  }
};

exports.popularVidsFromLiked = async function (req, res) {
  try {
    console.log('In YouTube video list Service');
    const result = await service.videos.list({
      auth: oauth2Client,
      part: 'snippet,contentDetails,statistics',
      maxResults: 10,
      myRating: 'like', 
    });

    //console.log('result: ' + result)
    var vidList = result.data.items
    const catArr = [] 
      vidList.forEach(vid => {
        catArr.push(vid.snippet.categoryId)
        console.log('CATEGORY ID: ' + vid.snippet.categoryId)
      });

      const maxCat = mode(catArr)
      console.log('maxCat: ' + maxCat)

      const response = await service.videos.list({
        auth: oauth2Client,
        part: 'snippet,contentDetails,statistics',
        maxResults: 5,
        chart: 'mostPopular',
        videoCategoryId: maxCat
      
    });
    //console.log('response: ' + response)
    return response.data;
  } catch (err) {
    console.log('big error catch');
    console.log(err)
    return err;
  }
};

function mode(array) {
  if(array.length == 0)
      return null;
  var modeMap = {};
  var maxEl = array[0], maxCount = 1;
  for(var i = 0; i < array.length; i++)
  {
      var el = array[i];
      if(modeMap[el] == null)
          modeMap[el] = 1;
      else
          modeMap[el]++;  
      if(modeMap[el] > maxCount)
      {
          maxEl = el;
          maxCount = modeMap[el];
      }
  }
  return maxEl;
}

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

async function subCount(cid) {
  console.log('cid: ' + cid)
  const response = await service.channels.list({
    auth: oauth2Client, 
    part: 'snippet,statistics',
    id: cid
  });
  const c = response.data.items[0].statistics.subscriberCount
  console.log('CHANNEL TITLE: ' + response.data.items[0].snippet.title)
  console.log('c: ' + c)
  return c
}

exports.mostSubscribers = async function (req, res) {
  try {
    // console.log('In YouTube Subscriptions Service');
    const result = await service.subscriptions.list({
      auth: oauth2Client,
      part: 'snippet,contentDetails',
      mine: true,
      maxResults: 50
    });

    var channelList = result.data.items
    const channelArr = [] 
    const subscriberCountArr = []
    var i = 0
    channelList.forEach(cid => {
      channelArr[i] = cid.snippet.resourceId.channelId
      console.log('CHANNEL ID: ' + cid.snippet.resourceId.channelId)
      subscriberCountArr[i] = subCount(channelArr[i])
      i++
    });
      
    return channelList[0];
  } catch (err) {
    console.log('big error catch');
    console.log(err)
    return err;
  }
};


