const path = require("path");
const bcrypt = require("bcrypt");
const Reddit = require('reddit');
const { link } = require("fs");
const config = require(path.resolve(__dirname, "../config.json"));
const User = require(path.resolve(__dirname, "../database/models/user"));

exports.test = async function (req, res) {
  try {
    // console.log(req.body);
    const email = req.body.email;
    let result = await User.find({ email: email });

    const reddit = new Reddit({
        username: result.redditUsername,
        password: result.redditPassword,
        appId: config.redditAppId,
        appSecret: config.redditSecret,
        userAgent: 'MyApp/1.0.0 (http://example.com)'
      })

    return;
    

  } catch (err) {
    console.log("big error catch")
    return err;
  }
};

  exports.login = async function (req, res) {
    try {
  
      // console.log(req.body);
      console.log("In Login");
      console.log(req.body)
      // let result = await User.find({ email: email });
      //TODO use reddit api to verify user

      // const randomString = ""
      // var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      // var charsLength = chars.length;

      // for ( var i = 0; i < 10; i++ ) {
      //   randomString += chars.charAt(Math.floor(Math.random() * 
      //   charsLength));
      // }

      const randomString = req.body.email


      const link = "https://www.reddit.com/api/v1/authorize?client_id=9Hu_S9TRq-MdOuPUvYe3Vw&response_type=code&state=" + randomString + 
      "&redirect_uri=https://127.0.0.1:3000/dashboard/&duration=temporary&scope=subscribe,vote,mysubreddits,save,read,privatemessages,identity,account,history";

      console.log("link");
      console.log(link);

      // let result = await User.findOneAndUpdate(
      //   {"email": email}, 
      //   {"redditUsername": redditEmail, "redditPassword": redditPassword},
      //   );
      return {link: link, verificationString: randomString};
      
  
    } catch (err) {
      console.log("big error catch")
      return err;
    }
  };