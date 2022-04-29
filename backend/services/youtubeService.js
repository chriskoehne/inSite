const User = require('../database/models/User');
const {google} = require('googleapis');
// const { isAsyncFunction } = require('util/types');
const youtubeClientId = process.env.YOUTUBE_CLIENT_ID;
const youtubeClientSecret = process.env.YOUTUBE_CLIENT_SECRET;
const c = require('../constants/constants');

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
    // console.log(err);
    console.log('big error catch youtube login');
    return err;
  }
};

exports.check = async function (email) {
  try {
    // console.log('In Reddit Login Service');
    let result = await User.findOne({ email: email })
    // console.log("in backend check, result is")
    // console.log(result)
    if (result.youtube) {
      return result.youtube
    } else {
      return false
    }

  } catch (err) {
    // console.log(err);
    console.log('big error catch youtube check');
    return err;
  }
};

exports.convert = async function (req, res) {
  try {
    // console.log('In YouTube Convert Service');
    // console.log(req.body);
    const code = req.body.code;

    const {tokens} = await oauth2Client.getToken(decodeURIComponent(code))

    oauth2Client.setCredentials(tokens);

    const email = req.body.email;
    // store the oauth2Client directly in the db
    let result = await User.findOneAndUpdate(
      { email: email },
      { youtube: tokens}
    );

    return tokens; //perhaps unnecessary given it is stored in the backend client?
  } catch (err) {
    console.log('big error catch youtube convert');
    // console.log(err)
    return err;
  }
};

exports.activity = async function (client) {
  try {
    // console.log('In YouTube Activity Service');

    oauth2Client.setCredentials(JSON.parse(client));
    const result = await service.activities.list({
      auth: oauth2Client,
      part: 'snippet,contentDetails',
      mine: true,
      maxResults: 25
    });
    return result.data;
  } catch (err) {
    console.log('big error catch youtube activity');
    console.log(err)
    return err;
  }
};

exports.likedVideos = async function (client) {
  try {
    // console.log('In YouTube liked videos Service');
    // console.log(client)
    oauth2Client.setCredentials(client);
    const result = await service.videos.list({
      auth: oauth2Client,
      part: 'snippet,contentDetails,statistics',
      myRating: 'like',
       //maxResults: 2
    });
    return result.data;
  } catch (err) {
    console.log('big error catch youtube liked');
    // console.log(err)
    return err;
  }
};

exports.myPopularCat = async function (client) {
  try {
    oauth2Client.setCredentials(JSON.parse(client));
    console.log('In YouTube POPULAR CATEGORY Service');
    const result = await service.search.list({
      auth: oauth2Client,
      part: 'snippet',
      type: 'video',
      forMine: true,
      maxResults: 30
    });
    return result.data;
  } catch (err) {
    console.log('big error catch');
    console.log(err)
    return err;
  }
};

exports.playlists = async function (client) {
  try {
    // console.log("playlists:")
    oauth2Client.setCredentials(JSON.parse(client));

    const result = await service.playlists.list({
      auth: oauth2Client,
      part: 'snippet,contentDetails',
      mine: true
    });
    // console.log(result)
    return result.data;
  } catch (err) {
    console.log('big error catch youtube playlists');
    // console.log(err)
    return err;
  }
};

exports.popularVidsFromLiked = async function (client) {
  try {
    // console.log('In YouTube popular vids from liked Service');
    // console.log(client)
    oauth2Client.setCredentials(JSON.parse(client));
    // console.log(oauth2Client)

    const result = await service.videos.list({
      auth: oauth2Client,
      part: 'snippet,contentDetails,statistics',
      maxResults: 10,
      myRating: 'like', 
    });

    //console.log('result: ' + result)
    let vidList = result.data.items
    const catArr = [] 
      vidList.forEach(vid => {
        catArr.push(vid.snippet.categoryId)
      });

      const maxCat = mode(catArr)
      // console.log('maxCat: ' + maxCat)

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
    console.log('big error catch youtube popular');
    console.log(err)
    return err;
  }
};

function mode(array) {
  if(array.length == 0)
      return null;
  let modeMap = {};
  let maxEl = array[0], maxCount = 1;
  for(let i = 0; i < array.length; i++)
  {
      let el = array[i];
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

exports.subscriptions = async function (client) {
  try {
    // console.log('In YouTube Subscriptions Service');
    // console.log(client)
    oauth2Client.setCredentials(client);

    const result = await service.subscriptions.list({
      auth: oauth2Client,
      part: 'snippet,contentDetails',
      mine: true,
      maxResults: 50
    });
    return result.data;
  } catch (err) {
    console.log('big error catch youtube subs');
    // console.log(err)
    return err;
  }
};

exports.channelInfo = async function (client) {
  
  try {
    oauth2Client.setCredentials(JSON.parse(client));
    console.log('In YouTube CHANNEL INFO Service');
    const result = await service.channels.list({
      auth: oauth2Client,
      part: 'snippet,statistics',
      mine: true,
      maxResults: 50
    });
    console.log('channelInfo returns: ' + result.data)
    return result.data;
  } catch (err) {
    console.log('big error catch');
    console.log(err)
    return err;
  }
};

exports.videoList = async function (client, channelId) {
  try {
    oauth2Client.setCredentials(JSON.parse(client));
    // const channelId = req.query.channelId;
    console.log('In YouTube VIDEO LIST for channel: ' + channelId);
    const result = await service.search.list({
      auth: oauth2Client,
        part: 'snippet',
        maxResults: 50,
        type: 'video',
        channelId: channelId

    });
    console.log('videoList returns: ' + result.data)
    return result.data;
  } catch (err) {
    console.log('big error catch');
    console.log(err)
    return err;
  }
};

exports.myPopularVids = async function (client) {
  try {
    oauth2Client.setCredentials(JSON.parse(client));
    // const channelId = req.query.myPopularVids;
    // console.log('In YouTube MY POPULAR VIDS for channel: ' + channelId);
    const result = await service.search.list({
      auth: oauth2Client,
        part: 'snippet',
        maxResults: 5,
        type: 'video',
        forMine: true,
        order: 'viewCount'

    });
    console.log('myPopularVids returns: ' + result.data)
    return result.data;
  } catch (err) {
    console.log('big error catch');
    console.log(err)
    return err;
  }
};

exports.myVidCats = async function (client, videoId) {
  try {
    oauth2Client.setCredentials(JSON.parse(client));
    // const videoId = req.query.videoId;
    console.log('In YouTube MY VIDCATS for video: ' + videoId);
    const result = await service.videos.list({
      auth: oauth2Client,
        part: 'snippet',
        id: videoId

    });
    console.log('myVidCats returns: ' + result.data)
    return result.data;
  } catch (err) {
    console.log('big error catch');
    console.log(err)
    return err;
  }
};

exports.myVidComments = async function (client) {
  try {
    oauth2Client.setCredentials(JSON.parse(client));
    const videoId = req.query.videoId;
    console.log('In YouTube MY VIDCOMMENTS for video: ' + videoId);
    const result = await service.commentThreads.list({
      auth: oauth2Client,
        part: 'snippet',
        videoId: videoId

    });
    console.log('myVidComments returns: ' + result.data)
    return result.data;
  } catch (err) {
    console.log('big error catch');
    console.log(err)
    return err;
  }
};

function getDifference(array1, array2) {
  return array1.filter(object1 => {
    return !array2.some(object2 => {
      return object1.id === object2.id;
    });
  });
}

exports.checkSubsNotif = async function (email, client) {
  try {
    // console.log('In youtube check subs notif');
    // console.log(email)
    const ans = await exports.subscriptions(client);
    const subs = ans.items;

    let user = await User.findOne({ email: email })

    const filter = { email: email };
    let update = { ['youtubeData.subs']: subs };

    const youtubeMilestones = user.notificationsHouse.youtubeMilestones;
    
    if (youtubeMilestones.prevsubs === null || youtubeMilestones.prevsubs.length === 0) {
      console.log("initializing youtube prevsubs in db")
      update['notificationsHouse.youtubeMilestones.prevsubs'] =
        subs;
    } else {
      
      update['notificationsHouse.youtubeMilestones.prevsubs'] = subs;

      let newsubs = getDifference(subs, youtubeMilestones.prevsubs)
      let unsubbed = getDifference(youtubeMilestones.prevsubs, subs)
      newsubs.forEach(async (sub) => {
        console.log('newsub: ' + sub.snippet.title)
        update['$push'] = {
          ['notificationsHouse.notifications']: {
            sm: 'youtube',
            content:
              'subscribed to new channel: ' + sub.snippet.title,
          },
        };
      });
      unsubbed.forEach(async (unsub) => {
        console.log("unsubbed: " + unsub.snippet.title)
        update['$push'] = {
          ['notificationsHouse.notifications']: {
            sm: 'youtube',
            content:
              'unsubscribed from channel: ' + unsub.snippet.title,
          },
        };
      });
      
    }
    let result = await User.findOneAndUpdate(filter, update);
    if (result === null || result === undefined) {
      return c.USER_FIND_AND_UPDATE_ERR;
    }
    return c.SUCCESS;
  } catch (err) {
    console.log('big error catch youtube subs notif');
    console.log(err)
    return err;
  }
};

exports.checkLikedVidsNotif = async function (email, client) {
  try {
    // console.log('In youtube check subs notif');
    // console.log(email)
    const ans = await exports.likedVideos(client);
    const vids = ans.items;

    let user = await User.findOne({ email: email })

    const filter = { email: email };
    let update = { ['youtubeData.likedVids']: vids };

    const youtubeMilestones = user.notificationsHouse.youtubeMilestones;
    // console.log(youtubeMilestones)
    if (youtubeMilestones.prevlikedVids === null || youtubeMilestones.prevlikedVids.length === 0) {
      // console.log("initializing youtube prevlikedVids in db")
      update['notificationsHouse.youtubeMilestones.prevlikedVids'] =
        vids;
    } else {
      
      update['notificationsHouse.youtubeMilestones.prevlikedVids'] = vids;

      let liked = getDifference(vids, youtubeMilestones.prevlikedVids)
      liked.forEach(async (like) => {
        console.log('new like: ' + like.snippet.title)
        update['$push'] = {
          ['notificationsHouse.notifications']: {
            sm: 'youtube',
            content:
              'Liked Video: ' + like.snippet.title,
          },
        };
      });
      
    }
    let result = await User.findOneAndUpdate(filter, update);
    if (result === null || result === undefined) {
      return c.USER_FIND_AND_UPDATE_ERR;
    }
    return c.SUCCESS;
  } catch (err) {
    console.log('big error catch youtube liked vids notif');
    console.log(err)
    return err;
  }
};

async function subCount(cid, client) {
  console.log('cid: ' + cid)
  oauth2Client.setCredentials(JSON.parse(client));

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

exports.mostSubscribers = async function (client) {
  try {
    // console.log('In YouTube Subscriptions Service');
    oauth2Client.setCredentials(JSON.parse(client));

    const result = await service.subscriptions.list({
      auth: oauth2Client,
      part: 'snippet,contentDetails',
      mine: true,
      maxResults: 50
    });

    let channelList = result.data.items
    const channelArr = [] 
    const subscriberCountArr = []
    let i = 0
    channelList.forEach(cid => {
      channelArr[i] = cid.snippet.resourceId.channelId
      console.log('CHANNEL ID: ' + cid.snippet.resourceId.channelId)
      subscriberCountArr[i] = subCount(channelArr[i], client)
      i++
    });
      
    return channelList[0];
  } catch (err) {
    console.log('big error catch youtube most subs');
    // console.log(err)
    return err;
  }
};

exports.mySubscribers = async function (client) {
  try {
    oauth2Client.setCredentials(JSON.parse(client));
    // console.log('In YouTube Subscriptions Service');
    const result = await service.subscriptions.list({
      auth: oauth2Client,
      part: 'snippet',
      myRecentSubscribers: true,
      maxResults: 50
    });

    return result.data;
  } catch (err) {
    console.log('my subs big error catch');
    console.log(err)
    return err;
  }
};


