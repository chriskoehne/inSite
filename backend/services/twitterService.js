const path = require('path');
const config = require(path.resolve(__dirname, '../config.json'));
var btoa = require('btoa');

exports.login = async function (email) {
  try {
    console.log('In Login');

    const challenge = btoa(String.fromCharCode.apply(null, 
        new Uint8Array(str)))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');

    const link =
    'https://twitter.com/i/oauth2/authorize?response_type=code&client_id=' +
    config.twitterClientID +
    'redirect_uri=https://127.0.0.1/dashboard&scope=tweet.read%20tweet.write%20users.read%20follows.read%20follows.write%20like.read&state=' +
    email +
    '&code_challenge=' + 
    challenge + 
    '&code_challenge_method=S256'

    console.log('link');
    console.log(link);

    return { link: link, verificationString: email };
  } catch (err) {
    console.log(err);
    console.log('big error catch');
    return err;
  }
};