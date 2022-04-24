var axios = require('axios');
var btoa = require('btoa');
var searchParams = require('url-search-params');
const User = require('../database/models/User');

if (process.env.DEV) {
    var redirectURI = 'https://127.0.0.1:3000/dashboard'
} else {
    var redirectURI = 'https://d33jcvm0fuhn35.cloudfront.net/dashboard'
}

exports.login = async function (email) {
    try {
        // console.log('In Twitter Login Service');

        const link = 'https://id.twitch.tv/oauth2/authorize?client_id=' 
        + process.env.TWITCH_CLIENT_ID + '&redirect_uri='
        + redirectURI + '&response_type=code&scope=' 
        + 'analytics%3Aread%3Aextensions+analytics%3Aread%3Agames+bits%3Aread+channel%3Aread%3Aeditors+channel%3Aread%3Agoals+channel%3Aread%3Ahype_train+channel%3Aread%3Apolls+channel%3Aread%3Apredictions+channel%3Aread%3Aredemptions+channel%3Aread%3Asubscriptions+user%3Aread%3Aemail+user%3Aread%3Afollows+user%3Aread%3Asubscriptions' 
        + '&state=twitch';

        return { link: link, verificationString: email };
    } catch (err) {
        console.log(err);
        console.log('big error catch');
        return err;
    }
};

exports.convert = async function (req, res) {
    try {
      // console.log('In Twitch Convert Service');
      const code = req.body.code;
      const email = req.body.email;
  
      var params = new searchParams();
      params.set('client_id', process.env.TWITCH_CLIENT_ID);
      params.set('client_secret', process.env.TWITCH_CLIENT_SECRET);
      params.set('code', code);
      params.set('grant_type', 'authorization_code');
      params.set('redirect_uri', redirectURI);
  
      const body = params;
  
      // const headers = {
      //   'Content-Type': 'application/x-www-form-urlencoded',
      //   Authorization: finalAuth,
      // };
  
      const result = await axios.post(
        'https://id.twitch.tv/oauth2/token',
        body
      );

      console.log("in twitch service")
      console.log(result.data)

      var intermediate = result.data;

    // delete intermediate.expires_in;
    intermediate.expires_in = Date.now() + intermediate.expires_in * 1000 - 10000; // ten seconds before it actually expires

    //for testing purposes:
    // intermediate.expires_in = Date.now() +  30000; // ten seconds before it actually expires


    let res = await User.findOneAndUpdate(
      { email: email },
      { twitch: intermediate}
    );
  
      return result.data;
    } catch (err) {
      console.log('big error catch');
      console.log(err)
      return err;
    }
  };

  exports.refresh = async function (email, token) {
    try {
      console.log("In twitch refresh");
      
      var params = new searchParams();
      params.set('client_id', process.env.TWITCH_CLIENT_ID);
      params.set('client_secret', process.env.TWITCH_CLIENT_SECRET);
      params.set('grant_type', 'refresh_token');
      params.set('refresh_token', token);
  
      const body = params;
  
      // const headers = {
      //   'Content-Type': 'application/x-www-form-urlencoded',
      //   Authorization: finalAuth,
      // };
  
      const result = await axios.post(
        'https://id.twitch.tv/oauth2/token',
        body
      );

      console.log("in twitch service")
      console.log(result.data)

      var intermediate = result.data;

    // delete intermediate.expires_in;
    intermediate.expires_in = Date.now() + intermediate.expires_in * 1000 - 10000; // ten seconds before it actually expires

    //for testing purposes:
    // intermediate.expires_in = Date.now() +  30000; // ten seconds before it actually expires


    let res = await User.findOneAndUpdate(
      { email: email },
      { twitch: intermediate}
    );
  
      return result.data;
    } catch (err) {
      console.log('twitch big error catch');
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
      if (result.twitch) {
        return result.twitch
      } else {
        return false
      }
  
    } catch (err) {
      console.log(err);
      console.log('big error catch');
      return err;
    }
  };