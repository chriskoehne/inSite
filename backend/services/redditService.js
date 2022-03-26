const Reddit = require('reddit');
const User = require('../database/models/User');
var btoa = require('btoa');
var axios = require('axios');
const { Agent } = require('http');
var searchParams = require('url-search-params');

if (process.env.DEV) {
  var redirectURI = 'https://127.0.0.1:3000/dashboard/'
} else {
  var redirectURI = 'https://d33jcvm0fuhn35.cloudfront.net/dashboard'
}

exports.test = async function (req, res) {
  try {
    // console.log('In Reddit Test Service');
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
    // console.log('In Reddit Login Service');
    const clientID = process.env.REDDIT_APP_ID;
    
    const link =
      'https://www.reddit.com/api/v1/authorize?client_id=' +
      clientID +
      '&response_type=code&state=reddit&redirect_uri=' + redirectURI + 
      '&duration=temporary&scope=subscribe,vote,mysubreddits,save,read,privatemessages,identity,account,history';

    return { link: link, verificationString: email };
  } catch (err) {
    console.log(err);
    console.log('big error catch');
    return err;
  }
};

exports.convert = async function (req, res) {
  try {
    // console.log("In Reddit Convert Service");
    
    const code = req.body.code;

    var params = new searchParams();
    params.set('grant_type', 'authorization_code');
    params.set('code', code);
    params.set('redirect_uri', redirectURI);

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
    
    const redditRes = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      body,
      { headers: headers }
    );
    
    return redditRes.data;
  } catch (err) {
    console.log('reddit big error catch');
    // console.log(err)
    return err;
  }
};

exports.redditMe = async function (req, res) {
  try {
    // console.log('In Reddit Me Service');
    
    const token = req.query.accessToken;
    
    const finalAuth = 'bearer ' + token;

    const headers = {
      Authorization: finalAuth,
    };
    const redditRes = await axios.get('https://oauth.reddit.com/api/v1/me', {
      headers: headers,
    });

    return redditRes.data;
  } catch (err) {
    console.log('big error catch');
    // console.log(err)
    return err;
  }
};

exports.userOverview = async function (req, res) {
  try {
    // console.log('In Reddit Overview Service');
    
    const token = req.query.accessToken;
    const username = req.query.username;
    
    const finalAuth = 'bearer ' + token;

    const headers = {
      Authorization: finalAuth,
    };
    const redditRes = await axios.get(
      'https://oauth.reddit.com/user/' + username + '/overview.json?limit=100',
      { headers: headers }
    );

    return redditRes.data;
  } catch (err) {
    console.log('big error catch');
    // console.log(err)
    return err;
  }
};

exports.userComments = async function (req, res) {
  try {
    // console.log('In Reddit Comments Service');
    const token = req.query.accessToken;
    const username = req.query.username;
    
    const finalAuth = 'bearer ' + token;
    const headers = {
      Authorization: finalAuth,
    };
    const redditRes = await axios.get(
      'https://oauth.reddit.com/user/' + username + '/comments.json?limit=100',
      { headers: headers }
    );
    
    return redditRes.data;
  } catch (err) {
    console.log('big error catch');
    return err;
  }
};

exports.userSubKarma = async function (req, res) {
  try {
    // console.log('In Reddit Sub Karma Service');
    const token = req.query.accessToken;

    const finalAuth = 'bearer ' + token;

    const headers = {
      Authorization: finalAuth,
    };

    const redditRes = await axios.get(
      'https://oauth.reddit.com/api/v1/me/karma',
      { headers: headers }
    );

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
    // console.log('In Reddit Total Karma Service');
    const token = req.query.accessToken;
    const username = req.query.username;

    const finalAuth = 'bearer ' + token;

    const headers = {
      Authorization: finalAuth,
    };


    const redditRes = await axios.get(
      'https://oauth.reddit.com/user/' + username + '/about',
      { headers: headers }
    );
    

    return redditRes.data;
  } catch (err) {
    console.log('big error catch');
    // console.log(err)
    const headers = {
      Authorization: finalAuth,
    };

    exports.userOverview = async function (req, res) {
      try {
        // console.log('In Reddit Overview Controversial Service');
        
        const token = req.query.accessToken;
        const username = req.query.username;
        
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

        return redditRes.data;
      } catch (err) {
        console.log('big error catch');
        // console.log(err)
        return err;
      }
    };

    exports.userComments = async function (req, res) {
      try {
        // console.log('In Reddit Comments Controversial Service');
        const token = req.query.accessToken;
        const username = req.query.username;
        
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
        
        return redditRes.data;
      } catch (err) {
        console.log('big error catch');
        return err;
      }
    };
  }
};
