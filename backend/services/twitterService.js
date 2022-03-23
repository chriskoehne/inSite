const path = require('path');
const config = require(path.resolve(__dirname, '../config.json'));
var btoa = require('btoa');
const randomstring = require("randomstring");
const crypto = require("crypto");
const base64url = require("base64url");
var searchParams = require('url-search-params');
var axios = require('axios');
const encodeUrl = require('encodeurl');
const OAuth = require('oauth')
const { promisify } = require('util')


exports.login = async function (email) {
  try {
    // console.log('In Login');

    const code_challenge = "challenge";

    const link =
    'https://twitter.com/i/oauth2/authorize?response_type=code&client_id=' +
    process.env.TWITTER_CLIENT_ID +
    '&redirect_uri=https%3A%2F%2F127.0.0.1%3A3000%2Fdashboard&scope=tweet.read%20tweet.write%20users.read%20follows.read%20follows.write%20like.read&state=' +
    email +
    '&code_challenge=' + 
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
    // console.log('in twitter convert service');
    // console.log(req.body);
    const code = req.body.code;

    var params = new searchParams();
    params.set('code', code);
    params.set('grant_type', 'authorization_code');
    params.set('redirect_uri', 'https://127.0.0.1:3000/dashboard');
    params.set('code_verifier', 'challenge')

    const body = params;
    const auth = btoa(process.env.TWITTER_CLIENT_ID + ':' + process.env.TWITTER_CLIENT_SECRET);
    const finalAuth = 'Basic ' + auth;

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: finalAuth,
    };
    //twitter post call
    // console.log("twitter post call");
    const twitterRes = await axios.post(
      'https://api.twitter.com/2/oauth2/token',
      body,
      { headers: headers }
    );

    // console.log("Result from Twitter:")
    // console.log(twitterRes);
    return twitterRes.data;
  } catch (err) {
    console.log('twitter big error catch');
    // console.log(err)
    return err;
  }
};

exports.test = async function (req, res) {
  try {
    const token = req.query.accessToken;
    // console.log('In Twitter Test. Token: ' + token);

    const headers = {
      Authorization: 'Bearer ' + token,
    };

    var params = new searchParams();
    params.set('query', 'entity:"food"');
    params.set('max_results', 10);

    // console.log("twitter post call");
    const twitterRes = await axios.get(
      'https://api.twitter.com/2/tweets/search/recent?query=entity:"food"&max_results=10',
      { headers: headers }
    );

    // console.log("Result from Twitter:")
    // console.log(twitterRes);
    return twitterRes.data;
  } catch (err) {
    console.log('twitter big error catch');
    // console.log(err)
    return err;
  }
};