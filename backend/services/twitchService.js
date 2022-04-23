var axios = require('axios');

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