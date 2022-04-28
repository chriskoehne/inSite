var btoa = require('btoa');
var searchParams = require('url-search-params');
const User = require('../database/models/User');
var axios = require('axios');

if (process.env.DEV) {
  var redirectURI = 'https://127.0.0.1:3000/dashboard'
} else {
  var redirectURI = 'https://d33jcvm0fuhn35.cloudfront.net/dashboard'
}

exports.login = async function (email) {
  try {
    // console.log('In Twitter Login Service');
    const code_challenge = "challenge";

    const link =
    'https://twitter.com/i/oauth2/authorize?response_type=code&client_id=' +
    process.env.TWITTER_CLIENT_ID +
    '&redirect_uri=' +  redirectURI + '&scope=mute.read%20tweet.read%20tweet.write%20users.read%20follows.read%20follows.write%20like.read%20offline.access&state=twitter&code_challenge=' + 
    code_challenge + 
    '&code_challenge_method=plain'

    return { link: link, verificationString: email };
  } catch (err) {
    console.log(err);
    console.log('big error catch');
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
    params.set('code_verifier', 'challenge')

    const body = params;
    const auth = btoa(process.env.TWITTER_CLIENT_ID + ':' + process.env.TWITTER_CLIENT_SECRET);
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
    intermediate.expires_in = Date.now() + intermediate.expires_in * 1000 - 10000; // ten seconds before it actually expires

    //for testing purposes:
    // intermediate.expires_in = Date.now() +  30000; // ten seconds before it actually expires


    let result = await User.findOneAndUpdate(
      { email: email },
      { twitter: intermediate}
    );

    return twitterRes.data;
  } catch (err) {
    console.log('twitter big error catch');
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
    const auth = btoa(process.env.TWITTER_CLIENT_ID + ':' + process.env.TWITTER_CLIENT_SECRET);
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

    console.log("after refresh")
    console.log(twitterRes.data)

    var intermediate = twitterRes.data;

    // delete intermediate.expires_in;
    intermediate.expires_in = Date.now() + intermediate.expires_in * 1000 - 10000; // ten seconds before it actually expires

    let result = await User.findOneAndUpdate(
      { email: email },
      { twitter: intermediate}
    );

    return twitterRes.data;
  } catch (err) {
    console.log('twitter big error catch');
    console.log(err)
    return err;
  }
};

exports.check = async function (email) {
  try {
    // console.log('In Reddit Login Service');
    let result = await User.findOne({ email: email })
    // console.log("in backend check, result is")
    // console.log(result)
    if (result.twitter) {
      return result.twitter
    } else {
      return false
    }

  } catch (err) {
    console.log(err);
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
    console.log('twitter big error catch');
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
      'https://api.twitter.com/2/tweets/search/recent?query=from:' + id + '&tweet.fields=created_at',
      { headers: headers }
    );
    // console.log('TWEETS RETURNED ARE: ' + twitterRes.data)
    return twitterRes.data;
  } catch (err) {
    console.log('twitter big error catch');
    console.log(err)
    return err;
  }
};

exports.me = async function (req, res) {
  try {
    // console.log('In Twitter Test Service');
    const token = req.query.accessToken;

    const headers = {
      Authorization: 'Bearer ' + token,
    };

    const twitterRes = await axios.get(
      'https://api.twitter.com/2/users/me',
      { headers: headers }
    );
    return twitterRes.data;
  } catch (err) {
    console.log('twitter big error catch');
    // console.log(err)
    return err;
  }
};

exports.tweets = async function (req, res) {
  try {
    console.log('In Twitter Test Service');
    const token = req.query.accessToken;
    const userID = req.query.userID;

    const headers = {
      Authorization: 'Bearer ' + token,
    };
    const twitterRes = await axios.get(
      'https://api.twitter.com/2/users/' + userID + '/tweets?max_results=100',
      { headers: headers }
    );
    return twitterRes.data;
  } catch (err) {
    console.log('twitter big error catch');
    // console.log(err)
    return err;
  }
};

exports.followers = async function (req, res) {
  try {
    // console.log('In Twitter Followers Service');
    const token = req.query.accessToken;
    const userID = req.query.userID;

    const headers = {
      Authorization: 'Bearer ' + token,
    };
    const twitterRes = await axios.get(
      'https://api.twitter.com/2/users/' + userID + '/followers',
      { headers: headers }
    );
    return twitterRes.data;
  } catch (err) {
    console.log('twitter big error catch');
    // console.log(err)
    return err;
  }
};

exports.following = async function (req, res) {
  try {
    // console.log('In Twitter Following Service');
    const token = req.query.accessToken;
    const userID = req.query.userID;

    const headers = {
      Authorization: 'Bearer ' + token,
    };
    const twitterRes = await axios.get(
      'https://api.twitter.com/2/users/' + userID + '/following?max_results=1000',
      { headers: headers }
    );
    return twitterRes.data;
  } catch (err) {
    console.log('twitter big error catch');
    // console.log(err)
    return err;
  }
};

exports.likes = async function (req, res) {
  try {
    // console.log('In Twitter Likes Service');
    const token = req.query.accessToken;
    const userID = req.query.userID;

    const headers = {
      Authorization: 'Bearer ' + token,
    };
    const twitterRes = await axios.get(
      'https://api.twitter.com/2/users/' + userID + '/tweets?exclude=retweets&max_results=100',
      { headers: headers }
    );
    return twitterRes.data;
  } catch (err) {
    console.log('twitter big error catch');
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
      'https://api.twitter.com/2/tweets?tweet.fields=public_metrics&ids=' + tweetsIds,
      { headers: headers }
    );
    return twitterRes.data;
  } catch (err) {
    console.log('twitter big error catch');
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
      'https://api.twitter.com/2/users?user.fields=public_metrics,profile_image_url&ids=' + ids,
      { headers: headers }
    );
    // console.log(twitterRes.data);
    return twitterRes.data;
  } catch (err) {
    console.log('twitter big error catch');
    // console.log(err)
    return err;
  }
};

  exports.ownedLists = async function (req, res) {
    try {
      
      const token = req.query.accessToken;
      const ids = req.query.userID;
      console.log(ids)
  
      const headers = {
        Authorization: 'Bearer ' + token,
      };
      const twitterRes = await axios.get(
        'https://api.twitter.com/2/users/' + ids + '/followed_lists?max_results=100',
        { headers: headers }
      );
      console.log(twitterRes.data);
      return twitterRes.data;
    } catch (err) {
      console.log('twitter big error catch');
      console.log(err)
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
        'https://api.twitter.com/2/tweets?tweet.fields=non_public_metrics&ids=' + tweetsIds,
        { headers: headers }
      );
      return twitterRes.data;
    } catch (err) {
      console.log('twitter big error catch');
      // console.log(err)
      return err;
    }
  };