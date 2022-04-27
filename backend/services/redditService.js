const Reddit = require('reddit');
const User = require('../database/models/User');
var btoa = require('btoa');
var axios = require('axios');
const { Agent } = require('http');
var searchParams = require('url-search-params');
const c = require('../constants/constants');

if (process.env.DEV) {
  var redirectURI = 'https://127.0.0.1:3000/dashboard/';
} else {
  var redirectURI = 'https://d33jcvm0fuhn35.cloudfront.net/dashboard';
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
      '&response_type=code&state=reddit&redirect_uri=' +
      redirectURI +
      '&duration=permanent&scope=subscribe,vote,mysubreddits,save,read,privatemessages,identity,account,history';

    return { link: link, verificationString: email };
  } catch (err) {
    console.log(err);
    console.log('big error catch');
    return err;
  }
};

exports.check = async function (email) {
  try {
    // console.log('In Reddit Login Service');
    let result = await User.findOne({ email: email });
    // console.log("in backend check, result is")
    // console.log(result)
    if (result.reddit) {
      return result.reddit;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    console.log('big error catch');
    return err;
  }
};

exports.convert = async function (code, email) {
  try {
    // console.log("In Reddit Convert Service");

    var params = new searchParams();
    params.set('grant_type', 'authorization_code');
    params.set('code', code);
    params.set('redirect_uri', redirectURI);

    const body = params;
    const redditAppId = process.env.REDDIT_APP_ID;
    const redditSecret = process.env.REDDIT_SECRET;

    const auth = btoa(redditAppId + ':' + redditSecret);
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

    var intermediate = redditRes.data;

    // delete intermediate.expires_in;
    intermediate.expires_in =
      Date.now() + intermediate.expires_in * 1000 - 10000; // ten seconds before it actually expires

    //for testing purposes
    // intermediate.expires_in = Date.now() +  30000; // ten seconds before it actually expires

    let result = await User.findOneAndUpdate(
      { email: email },
      { reddit: intermediate }
    );

    return redditRes.data;
  } catch (err) {
    console.log('reddit big error catch');
    // console.log(err)
    return err;
  }
};

exports.refresh = async function (token, email) {
  try {
    console.log('In Reddit refresh');

    var params = new searchParams();
    params.set('grant_type', 'refresh_token');
    params.set('refresh_token', token);

    const body = params;
    const redditAppId = process.env.REDDIT_APP_ID;
    const redditSecret = process.env.REDDIT_SECRET;

    const auth = btoa(redditAppId + ':' + redditSecret);
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

    var intermediate = redditRes.data;

    // delete intermediate.expires_in;
    intermediate.expires_in =
      Date.now() + intermediate.expires_in * 1000 - 10000; // ten seconds before it actually expires

    let result = await User.findOneAndUpdate(
      { email: email },
      { reddit: intermediate }
    );

    return redditRes.data; //includes access token, etc
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

exports.redditUsername = async function (token) {
  try {
    // console.log('In Reddit Me Service');

    const finalAuth = 'bearer ' + token;
    const headers = {
      Authorization: finalAuth,
    };
    const redditRes = await axios.get('https://oauth.reddit.com/api/v1/me', {
      headers: headers,
    });

    return redditRes.data.name;
  } catch (err) {
    console.log('big error catch');
    console.log(err);
    return err;
  }
};

exports.userOverview = async function (email, token, username) {
  try {
    console.log('In Reddit Overview Service');
    const finalAuth = 'bearer ' + token;

    const headers = {
      Authorization: finalAuth,
    };
    const redditRes = await axios.get(
      'https://oauth.reddit.com/user/' + username + '/overview.json?limit=100',
      { headers: headers }
    );
    const redditData = redditRes.data;
    let posts = [];
    let comments = [];
    let messages = [];
    let array = redditData.data.children;
    array.forEach(function (item, index) {
      switch (item.kind) {
        case c.COMMENT:
          comments.push(item.data);
          break;
        case c.MESSAGE:
          messages.push(item.data);
          break;
        case c.LINK:
          posts.push(item.data);
      }
    });
    const data = {
      posts: posts,
      comments: comments,
      messages: messages,
    };
    exports.updateRedditData(email, 'overview', data); //we don't need to await the result from this
    return data;
  } catch (err) {
    console.log('big error catch');
    // console.log(err)
    return err;
  }
};

// I don't think we use this
exports.userComments = async function (token, username) {
  try {
    // console.log('In Reddit Comments Service');

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

// I don't think we use this
exports.userSubKarma = async function (email, token) {
  try {
    // console.log('In Reddit Sub Karma Service');

    const finalAuth = 'bearer ' + token;

    const headers = {
      Authorization: finalAuth,
    };

    const redditRes = await axios.get(
      'https://oauth.reddit.com/api/v1/me/karma',
      { headers: headers }
    );

    const subKarmaList = redditRes.data.data.slice(0, 5);
    exports.updateRedditData(email, 'subKarma', subKarmaList);
    return subKarmaList;
  } catch (err) {
    console.log('big error catch');
    // console.log(err)
    return err;
  }
};

exports.userTotalKarma = async function (email, token, username) {
  try {
    // console.log('In Reddit Total Karma Service');

    const finalAuth = 'bearer ' + token;

    const headers = {
      Authorization: finalAuth,
    };

    const redditRes = await axios.get(
      'https://oauth.reddit.com/user/' + username + '/about',
      { headers: headers }
    );
    const user = await User.findOne({ email: email });
    const karma = {
      commentKarma: redditRes.data.data.comment_karma,
      linkKarma: redditRes.data.data.link_karma,
      awardKarma: redditRes.data.data.awardee_karma,
      totalKarma: redditRes.data.data.total_karma,
      redditHistory: user.redditHistory
    };
    // console.log(totalKarma)
    // exports.updateRedditData(email, 'totalKarma', totalKarma);
    exports.updateKarma(email, karma);

    return karma;
  } catch (err) {
    console.log('big error catch');
    return err;
  }
};

exports.updateRedditData = async function (email, property, data) {
  try {
    // console.log('yo');
    console.log(email);
    const user = await User.findOne({ email: email });
    if (!user) {
      console.log('here');
      return c.USER_NOT_FOUND;
    }
    if (!user.settings.permissions.reddit) {
      return c.USER_INVALID_PERMISSIONS;
    }
    const filter = { email: email };
    const update = { [`redditData.${property}`]: data };
    let result = await User.findOneAndUpdate(filter, update);
    if (result === null || result === undefined) {
      return c.USER_FIND_AND_UPDATE_ERR;
    }
    console.log('success ' + property);
    return c.SUCCESS;
  } catch (err) {
    console.log(err);
    return c.GENERAL_TRY_CATCH_ERR;
  }
};

exports.updateKarma = async function (email, karma) {
  try {
    // console.log('yo');
    console.log(email);
    const user = await User.findOne({ email: email });
    if (!user) {
      console.log('here');
      return c.USER_NOT_FOUND;
    }
    if (!user.settings.permissions.reddit) {
      return c.USER_INVALID_PERMISSIONS;
    }
    const filter = { email: email };
    let update = { ['redditData.totalKarma']: karma };

    const redditMilestones = user.notificationsHouse.redditMilestones;
    
    update['$push'] = {
      ['redditHistory.karmaHistory']: {
        karma: karma.totalKarma,
      },
    };
    if (redditMilestones.prevTotalKarma === null) {
      update['notificationsHouse.redditMilestones.prevTotalKarma'] =
        karma.totalKarma;
    } else if (karma.totalKarma - redditMilestones.prevTotalKarma >= 3) {
      // do an update and create a notification
      update['notificationsHouse.redditMilestones.prevTotalKarma'] =
        karma.totalKarma;
      update['$push'] = {
        ['notificationsHouse.notifications']: {
          sm: 'reddit',
          content:
            'karma increased by ' +
            (karma.totalKarma - redditMilestones.prevTotalKarma),
        },
      };
    }

    let result = await User.findOneAndUpdate(filter, update);
    if (result === null || result === undefined) {
      return c.USER_FIND_AND_UPDATE_ERR;
    }
    return c.SUCCESS;
  } catch (err) {
    console.log(err);
    return c.GENERAL_TRY_CATCH_ERR;
  }
};
