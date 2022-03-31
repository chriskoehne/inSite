var btoa = require('btoa');
var searchParams = require('url-search-params');
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
    '&redirect_uri=' +  redirectURI + '&scope=tweet.read%20tweet.write%20users.read%20follows.read%20follows.write%20like.read&state=twitter&code_challenge=' + 
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
    // console.log('In Twitter Convert Service');
    const code = req.body.code;

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

    return twitterRes.data;
  } catch (err) {
    console.log('twitter big error catch');
    // console.log(err)
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
    // console.log('In Twitter Test Service');
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
      'https://api.twitter.com/2/users/' + userID + '/tweets?exclude=retweets',
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