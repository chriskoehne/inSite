var axios = require('axios');
var btoa = require('btoa');
var searchParams = require('url-search-params');

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
  
      return result.data;
    } catch (err) {
      console.log('big error catch');
      console.log(err)
      return err;
    }
  };