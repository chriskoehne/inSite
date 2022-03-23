const Reddit = require('reddit');
const User = require('../database/models/User');
var btoa = require('btoa');
var axios = require('axios');
const { Agent } = require('http');
var formData = require('form-data');
var searchParams = require('url-search-params');

exports.test = async function (req, res) {
  try {
    // console.log(req.body);
    const email = req.body.email;
    let result = await User.find({ email: email });

    const reddit = new Reddit({
      username: result.redditUsername,
      password: result.redditPassword,
      appId: process.env.REDDIT_APP_ID,
      appSecret: process.env.REDDIT_SECRET,
      userAgent: 'MyApp/1.0.0 (http://example.com)',
    });

    return;
  } catch (err) {
    console.log('big error catch');
    return err;
  }
};

exports.login = async function (email) {
  try {
    console.log('In Login');
    const clientID = process.env.REDDIT_APP_ID;
    //TODO change the client_id to grab from config file
    const link =
      'https://www.reddit.com/api/v1/authorize?client_id=' +
      clientID +
      '&response_type=code&state=' +
      email +
      '&redirect_uri=https://127.0.0.1:3000/dashboard/&duration=temporary&scope=subscribe,vote,mysubreddits,save,read,privatemessages,identity,account,history';

    console.log('link');
    console.log(link);

    return { link: link, verificationString: email };
  } catch (err) {
    console.log(err);
    console.log('big error catch');
    return err;
  }
};

exports.convert = async function (req, res) {
  try {
    // console.log("in reddit convert service");
    // console.log(req.body);
    const code = req.body.code;

    var params = new searchParams();
    params.set('grant_type', 'authorization_code');
    params.set('code', code);
    params.set('redirect_uri', 'https://127.0.0.1:3000/dashboard/');

    const body = params;
    const redditAppId = process.env.REDDIT_APP_ID;
    const redditSecret = process.env.REDDIT_SECRET;

    const auth = btoa(
      redditAppId + ':' + redditSecret
    );
    const finalAuth = 'Basic ' + auth;

    const headers = {
      Authorization: finalAuth,
      'User-Agent': 'inSite by inSite',
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    //reddit post call
    const redditRes = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      body,
      { headers: headers }
    );
    // console.log("in service")
    //console.log(redditRes.data)
    return redditRes.data;
  } catch (err) {
    console.log('reddit big error catch');
    // console.log(err)
    return err;
  }
};

exports.redditMe = async function (req, res) {
  try {
    // console.log(req.body);
    const token = req.query.accessToken;
    // const subReddit = req.body.subReddit;

    // console.log("in service, token is")
    // console.log(token)
    // const body = params;
    const finalAuth = 'bearer ' + token;

    const headers = {
      Authorization: finalAuth,
    };
    const redditRes = await axios.get('https://oauth.reddit.com/api/v1/me', {
      headers: headers,
    });
    // console.log("service subreddit answersssss:")
    //console.log(redditRes)
    // let ans = redditRes.toJSON();
    // console.log(ans.status)
    // console.log(ans.name)

    return redditRes.data;
  } catch (err) {
    console.log('big error catch');
    // console.log(err)
    return err;
  }
};

exports.userOverview = async function (req, res) {
  try {
    // console.log(req.body);
    const token = req.query.accessToken;
    const username = req.query.username;
    // console.log(req)
    console.log('user ' + username);
    // const subReddit = req.body.subReddit;

    console.log('in overview service, username is');
    console.log(username);

    console.log('in service, token is');
    console.log(token);
    // const body = params;
    const finalAuth = 'bearer ' + token;

    const headers = {
      Authorization: finalAuth,
    };
    const redditRes = await axios.get(
      'https://oauth.reddit.com/user/' + username + '/overview.json?limit=100',
      { headers: headers }
    );
    // console.log("service subreddit answer:")

    // console.log(ans.name)
    // console.log(redditRes.data)

    return redditRes.data;
  } catch (err) {
    console.log('big error catch');
    // console.log(err)
    return err;
  }
};

exports.userComments = async function (req, res) {
  try {
    const token = req.query.accessToken;
    const username = req.query.username;
    // console.log(req)
    // console.log("user " + username)
    // console.log("in service, token is")
    // console.log(token)
    // const body = params;
    const finalAuth = 'bearer ' + token;
    const headers = {
      Authorization: finalAuth,
    };
    const redditRes = await axios.get(
      'https://oauth.reddit.com/user/' + username + '/comments.json?limit=100',
      { headers: headers }
    );
    // console.log("service subreddit answer:")
    // console.log(redditRes)
    return redditRes.data;
  } catch (err) {
    console.log('big error catch');
    return err;
  }
};

exports.userSubKarma = async function (req, res) {
  try {
    const token = req.query.accessToken;

    const finalAuth = 'bearer ' + token;

    const headers = {
      Authorization: finalAuth,
    };

    // console.log("Sub Karma Info");

    const redditRes = await axios.get(
      'https://oauth.reddit.com/api/v1/me/karma',
      { headers: headers }
    );
    // console.log(redditRes.data);

    return redditRes.data;
  } catch (err) {
    console.log('big error catch');
    // console.log(err)
    const headers = {
      Authorization: finalAuth,
    };
  }
};

exports.userTotalKarma = async function (req, res) {
  try {
    const token = req.query.accessToken;
    const username = req.query.username;

    const finalAuth = 'bearer ' + token;

    const headers = {
      Authorization: finalAuth,
    };

    // console.log("Total Karma Info");

    const redditRes = await axios.get(
      'https://oauth.reddit.com/user/' + username + '/about',
      { headers: headers }
    );
    // console.log("Comment Karma: " + redditRes.data.data.comment_karma);
    // console.log("Link Karma: " + redditRes.data.data.link_karma);
    // console.log("Award Karma: " + redditRes.data.data.awardee_karma);

    return redditRes.data;
  } catch (err) {
    console.log('big error catch');
    // console.log(err)
    const headers = {
      Authorization: finalAuth,
    };

    exports.userOverview = async function (req, res) {
      try {
        // console.log(req.body);
        const token = req.query.accessToken;
        const username = req.query.username;
        // console.log(req)
        console.log('user ' + username);
        // const subReddit = req.body.subReddit;

        console.log('in overview service, username is');
        console.log(username);

        console.log('in service, token is');
        console.log(token);
        // const body = params;
        const finalAuth = 'bearer ' + token;

        const headers = {
          Authorization: finalAuth,
        };
        const redditRes = await axios.get(
          'https://oauth.reddit.com/user/' +
            username +
            '/overview?limit=100&sort=controversial',
          { headers: headers }
        );
        // console.log("service subreddit answer:")

        // console.log(ans.name)
        //console.log(redditRes)

        return redditRes.data;
      } catch (err) {
        console.log('big error catch');
        // console.log(err)
        return err;
      }
    };

    exports.userComments = async function (req, res) {
      try {
        const token = req.query.accessToken;
        const username = req.query.username;
        // console.log(req)
        // console.log("user " + username)
        // console.log("in service, token is")
        // console.log(token)
        // const body = params;
        const finalAuth = 'bearer ' + token;
        const headers = {
          Authorization: finalAuth,
        };
        const redditRes = await axios.get(
          'https://oauth.reddit.com/user/' +
            username +
            '/comments.json?limit=100&sort=controversial',
          { headers: headers }
        );
        // console.log("service subreddit answer:")
        // console.log(redditRes)
        return redditRes.data;
      } catch (err) {
        console.log('big error catch');
        return err;
      }
    };
  }
};
