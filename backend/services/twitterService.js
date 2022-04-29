var btoa = require('btoa');
var searchParams = require('url-search-params');
const User = require('../database/models/User');
const c = require('../constants/constants');

var axios = require('axios');

if (process.env.DEV) {
  var redirectURI = 'https://127.0.0.1:3000/dashboard';
} else {
  var redirectURI = 'https://d33jcvm0fuhn35.cloudfront.net/dashboard';
}

exports.login = async function (email) {
  try {
    // console.log('In Twitter Login Service');
    const code_challenge = 'challenge';

    const link =
      'https://twitter.com/i/oauth2/authorize?response_type=code&client_id=' +
      process.env.TWITTER_CLIENT_ID +
      '&redirect_uri=' +
      redirectURI +
      '&scope=list.read%20mute.read%20tweet.read%20tweet.write%20users.read%20follows.read%20follows.write%20like.read%20offline.access&state=twitter&code_challenge=' +
      code_challenge +
      '&code_challenge_method=plain';

    return { link: link, verificationString: email };
  } catch (err) {
    console.log(err);
    console.log('big error catch twitter login');
    return err;
  }
};

exports.convert = async function (req, res) {
  try {
    console.log('In Twitter refresh Service');
    const code = req.body.code;
    const email = req.body.email;

    var params = new searchParams();
    params.set('code', code);
    params.set('grant_type', 'authorization_code');
    params.set('redirect_uri', redirectURI);
    params.set('code_verifier', 'challenge');

    const body = params;
    const auth = btoa(
      process.env.TWITTER_CLIENT_ID + ':' + process.env.TWITTER_CLIENT_SECRET
    );
    const finalAuth = 'Basic ' + auth;

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: finalAuth,
    };

    const twitterRes = await axios.post(
      'https://api.twitter.com/2/oauth2/token',
      body,
      { headers: headers }
    );

    // console.log("after twitter conversion")
    // console.log(twitterRes.data)

    var intermediate = twitterRes.data;

    // delete intermediate.expires_in;
    intermediate.expires_in =
      Date.now() + intermediate.expires_in * 1000 - 10000; // ten seconds before it actually expires

    //for testing purposes:
    // intermediate.expires_in = Date.now() +  30000; // ten seconds before it actually expires

    let result = await User.findOneAndUpdate(
      { email: email },
      { twitter: intermediate }
    );

    return twitterRes.data;
  } catch (err) {
    console.log('big error catch twitter convert');
    // console.log(err)
    return err;
  }
};

exports.refresh = async function (email, token) {
  try {
    // console.log('In Twitter Tweet Count Service');
    // const token = req.query.refreshToken;
    // const id = req.query.userId;

    var params = new searchParams();
    params.set('grant_type', 'refresh_token');
    params.set('refresh_token', token);
    // params.set('client_id', process.env.TWITTER_CLIENT_ID)

    const body = params;
    const auth = btoa(
      process.env.TWITTER_CLIENT_ID + ':' + process.env.TWITTER_CLIENT_SECRET
    );
    const finalAuth = 'Basic ' + auth;

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: finalAuth,
    };

    const twitterRes = await axios.post(
      'https://api.twitter.com/2/oauth2/token',
      body,
      { headers: headers }
    );

    console.log('after refresh');
    // console.log(twitterRes.data);

    var intermediate = twitterRes.data;

    // delete intermediate.expires_in;
    intermediate.expires_in =
      Date.now() + intermediate.expires_in * 1000 - 10000; // ten seconds before it actually expires

    let result = await User.findOneAndUpdate(
      { email: email },
      { twitter: intermediate }
    );

    return twitterRes.data;
  } catch (err) {
    console.log('big error catch twitter refresh', email);
    console.log(err.message);
    return err;
  }
};

exports.check = async function (email) {
  try {
    let result = await User.findOne({ email: email });
    // console.log("in backend check, result is")
    // console.log(result)
    if (result.twitter) {
      return result.twitter;
    } else {
      return false;
    }
  } catch (err) {
    // console.log(err);
    console.log('big error catch');
    return err;
  }
};

exports.test = async function (req, res) {
  try {
    // console.log('In Twitter Test Service');
    const token = req.query.accessToken;

    const headers = {
      Authorization: 'Bearer ' + token,
    };

    var params = new searchParams();
    params.set('query', 'entity:"food"');
    params.set('max_results', 10);

    const twitterRes = await axios.get(
      'https://api.twitter.com/2/tweets/search/recent?query=entity:"food"&max_results=10',
      { headers: headers }
    );
    return twitterRes.data;
  } catch (err) {
    console.log('big error catch twitter test');
    // console.log(err)
    return err;
  }
};

exports.tweetCount = async function (req, res) {
  try {
    // console.log('In Twitter Tweet Count Service');
    const token = req.query.accessToken;
    const id = req.query.userId;

    const headers = {
      Authorization: 'Bearer ' + token,
    };

    // var params = new searchParams();
    // console.log('Twitter id: ' + id)
    // params.set('query', 'from:RS_ROCKINROHAN');
    // //params.set('tweet.fields', 'created_at')
    // params.set('max_results', 10);

    const twitterRes = await axios.get(
      'https://api.twitter.com/2/tweets/search/recent?query=from:' +
        id +
        '&tweet.fields=created_at',
      { headers: headers }
    );
    // console.log('TWEETS RETURNED ARE: ' + twitterRes.data)
    return twitterRes.data;
  } catch (err) {
    console.log('big error catch twitter tweet count');
    console.log(err);
    return err;
  }
};

exports.me = async function (accessToken) {
  try {
    // console.log('In Twitter Test Service');

    const headers = {
      Authorization: 'Bearer ' + accessToken,
    };

    const twitterRes = await axios.get('https://api.twitter.com/2/users/me', {
      headers: headers,
    });
    return twitterRes.data;
  } catch (err) {
    console.log('big error catch twitter me');
    console.log(err.message);
    return err;
  }
};

exports.tweets = async function (req, res) {
  try {
    console.log('In Twitter Test Service');
    const token = req.query.accessToken;
    const userId = req.query.userId;

    const headers = {
      Authorization: 'Bearer ' + token,
    };
    const twitterRes = await axios.get(
      'https://api.twitter.com/2/users/' + userId + '/tweets?max_results=100',
      { headers: headers }
    );
    return twitterRes.data;
  } catch (err) {
    console.log('big error catch twitter tweets');
    // console.log(err)
    return err;
  }
};

exports.followers = async function (token, userId, email) {
  try {
    // console.log('In Twitter Followers Service');

    const headers = {
      Authorization: 'Bearer ' + token,
    };
    const twitterRes = await axios.get(
      'https://api.twitter.com/2/users/' + userId + '/followers',
      { headers: headers }
    );
    // console.log('followers');
    // console.log(twitterRes.data.meta.result_count);
    exports.updateFollowersNotifications(
      email,
      twitterRes.data.meta.result_count
    );
    return twitterRes.data;
  } catch (err) {
    console.log('big error catch twitter followers');
    console.log(email, err.message);
    return err;
  }
};

exports.following = async function (token, userId, email) {
  try {
    // console.log('In Twitter Following Service');
    const headers = {
      Authorization: 'Bearer ' + token,
    };
    const twitterRes = await axios.get(
      'https://api.twitter.com/2/users/' +
        userId +
        '/following?max_results=1000',
      { headers: headers }
    );
    // console.log(twitterRes.data.meta.result_count);
    exports.updateFollowingNotifications(
      email,
      twitterRes.data.meta.result_count
    );
    return twitterRes.data;
  } catch (err) {
    console.log('big error catch twitter following');
    console.log(email, err.message);
    // console.log(err)
    return err;
  }
};

exports.likes = async function (req, res) {
  try {
    // console.log('In Twitter Likes Service');
    const token = req.query.accessToken;
    const userId = req.query.userId;

    const headers = {
      Authorization: 'Bearer ' + token,
    };
    const twitterRes = await axios.get(
      'https://api.twitter.com/2/users/' +
        userId +
        '/tweets?exclude=retweets&max_results=100',
      { headers: headers }
    );
    return twitterRes.data;
  } catch (err) {
    console.log('big error catch twitter likes');
    // console.log(err)
    return err;
  }
};

exports.tweetLikes = async function (req, res) {
  try {
    // console.log('In Twitter Tweet Likes Service');
    const token = req.query.accessToken;
    const tweetsIds = req.query.tweetsIds;
    // console.log('IDs: ' + tweetsIds);

    const headers = {
      Authorization: 'Bearer ' + token,
    };
    const twitterRes = await axios.get(
      'https://api.twitter.com/2/tweets?tweet.fields=public_metrics&ids=' +
        tweetsIds,
      { headers: headers }
    );
    // console.log(twitterRes.data);
    return twitterRes.data;
  } catch (err) {
    console.log('big error catch twitter likes');
    // console.log(err)
    return err;
  }
};

exports.followMetrics = async function (req, res) {
  try {
    // console.log('In Twitter Tweet Likes Service');
    const token = req.query.accessToken;
    const ids = req.query.ids;
    // console.log('IDs: ' + tweetsIds);

    const headers = {
      Authorization: 'Bearer ' + token,
    };
    const twitterRes = await axios.get(
      'https://api.twitter.com/2/users?user.fields=public_metrics,profile_image_url&ids=' +
        ids,
      { headers: headers }
    );
    return twitterRes.data;
  } catch (err) {
    console.log('big error catch twitter metrics');
    // console.log(err)
    return err;
  }
};

exports.pinnedLists = async function (req, res) {
  try {
    const token = req.query.accessToken;
    const ids = req.query.userId;
    console.log(ids);

    const headers = {
      Authorization: 'Bearer ' + token,
    };
    const twitterRes = await axios.get(
      'https://api.twitter.com/2/users/' +
        ids +
        '/pinned_lists?list.fields=name,description,follower_count,member_count,id',
      { headers: headers }
    );
    //console.log(twitterRes.data);
    return twitterRes.data;
  } catch (err) {
    console.log('big error catch twitter pinned');
    //console.log(err)
    return err;
  }
};

exports.nonPublic = async function (req, res) {
  try {
    // console.log('In Twitter Tweet Likes Service');
    const token = req.query.accessToken;
    const tweetsIds = req.query.tweetsIds;
    // console.log('IDs: ' + tweetsIds);

    const headers = {
      Authorization: 'Bearer ' + token,
    };
    const twitterRes = await axios.get(
      'https://api.twitter.com/2/tweets?tweet.fields=non_public_metrics&ids=' +
        tweetsIds,
      { headers: headers }
    );
    return twitterRes.data;
  } catch (err) {
    console.log('big error catch twitter nonPublic');
    // console.log(err)
    return err;
  }
};

exports.mutes = async function (req, res) {
  try {
    // console.log('In Twitter Tweet Likes Service');
    const token = req.query.accessToken;
    const userId = req.query.userId;
    // console.log(req.query)
    // console.log('IDs: ' + tweetsIds);

    const headers = {
      Authorization: 'Bearer ' + token,
    };
    const twitterRes = await axios.get(
      'https://api.twitter.com/2/users/' + userId + '/muting',
      { headers: headers }
    );
    return twitterRes.data;
  } catch (err) {
    console.log('wtf did i do wrong');
    console.log(err.message);
    return err;
  }
};

exports.updateFollowersNotifications = async function (email, numFollowers) {
  // console.log('updating follower')

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      console.log('here');
      return c.USER_NOT_FOUND;
    }
    if (!user.settings.permissions.twitter) {
      return c.USER_INVALID_PERMISSIONS;
    }
    const filter = { email: email };
    let update = {};
    let notifications = [];

    const twitterMilestones = user.notificationsHouse.twitterMilestones;
    if (false) {
      // if (typeof(twitterMilestones.prevNumFollowers) !== 'number') {
      update['notificationsHouse.twitterMilestones.prevNumFollowers'] =
        numFollowers;
    } else if (numFollowers - twitterMilestones.prevNumFollowers >= 1) {
      // do an update and create a notification
      update['notificationsHouse.twitterMilestones.prevNumFollowers'] =
        numFollowers;

      notifications.push({
        sm: 'twitter',
        content:
          'total number of followers increased by ' +
          (numFollowers - twitterMilestones.prevNumFollowers),
      });
    }
    update['$push'] = {};
    if (numFollowers !== twitterMilestones.prevNumFollowers) {
      update['$push']['twitterHistory.followerHistory'] = {
        numFollowers: numFollowers,
      };
    }
    if (notifications && notifications.length !== 0 && notifications !== []) {
      console.log(notifications);
      update['$push']['notificationsHouse.notifications'] = notifications ;
    }
    console.log(update);
    let result = await User.findOneAndUpdate(filter, update);
    if (result === null || result === undefined) {
      return c.USER_FIND_AND_UPDATE_ERR;
    }
    return c.SUCCESS;
  } catch (err) {
    console.log(err.stack);
    return c.GENERAL_TRY_CATCH_ERR;
  }
};

exports.updateFollowingNotifications = async function (email, numFollowing) {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      console.log('no user');
      return c.USER_NOT_FOUND;
    }
    if (!user.settings.permissions.twitter) {
      console.log('no permissions');
      return c.USER_INVALID_PERMISSIONS;
    }
    const filter = { email: email };
    let update = {};
    let notifications = [];

    const twitterMilestones = user.notificationsHouse.twitterMilestones;

    if (false) {
      // if (typeof(twitterMilestones.prevNumFollowing) !== 'number') {
      update['notificationsHouse.twitterMilestones.prevNumFollowing'] =
        numFollowing;
    } else if (numFollowing - twitterMilestones.prevNumFollowing >= 1) {
      // do an update and create a notification
      update['notificationsHouse.twitterMilestones.prevNumFollowing'] =
        numFollowing;

      notifications.push({
        sm: 'twitter',
        content:
          'total number of following increased by ' +
          (numFollowing - twitterMilestones.prevNumFollowing),
      });
    }
    if (notifications && notifications.length !== 0 && notifications !== []) {
      update['$push'] = {
        ['notificationsHouse.notifications']: notifications,
      };
    }
    console.log(update)
    let result = await User.findOneAndUpdate(filter, update);
    if (result === null || result === undefined) {
      return c.USER_FIND_AND_UPDATE_ERR;
    }
    return c.SUCCESS;
  } catch (err) {
    console.log(err.stack);
    return c.GENERAL_TRY_CATCH_ERR;
  }
};
