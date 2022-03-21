const path = require('path');
const config = require(path.resolve(__dirname, '../config.json'));
var btoa = require('btoa');
const randomstring = require("randomstring");
const crypto = require("crypto");
const base64url = require("base64url");

exports.login = async function (email) {
  try {
    console.log('In Login');

    // const auth = btoa(config.twitterClientID + ':' + config.twitterClientSecret);
    // const finalAuth = 'Basic ' + auth;

    // const code_verifier = randomstring.generate(128);

    // const base64Digest = crypto.createHash("sha256").update(code_verifier).digest("base64");
  
    // const code_challenge = base64url.fromBase64(base64Digest);

    const code_challenge = "challenge";

    const link =
    'https://twitter.com/i/oauth2/authorize?response_type=code&client_id=' +
    config.twitterClientID +
    '&redirect_uri=https%3A%2F%2F127.0.0.1%3A3000%2Fdashboard&scope=tweet.read%20tweet.write%20users.read%20follows.read%20follows.write%20like.read&state=' +
    email +
    '&code_challenge=' + 
    code_challenge + 
    '&code_challenge_method=plain'

    // console.log('link');
    // console.log(link);

    // console.log('challenge');
    // console.log(code_challenge);

    // const fake_link = "www.google.com";

    return { link: link, verificationString: email };
  } catch (err) {
    console.log(err);
    console.log('big error catch');
    return err;
  }
};