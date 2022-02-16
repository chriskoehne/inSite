const path = require("path");
const bcrypt = require("bcrypt");
const Reddit = require('reddit')
const config = require(path.resolve(__dirname, "../config.json"));
const User = require(path.resolve(__dirname, "../database/models/user"));

const randomString = createRandomString();

function createRandomString() {
  var result = ""
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charsLength = chars.length;

  for ( var i = 0; i < 10; i++ ) {
    result += chars.charAt(Math.floor(Math.random() * 
    charsLength));
  }

  return result;
}

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

exports.getUser = async function (req, res) {
    try {
      // console.log(req.body);
      const email = req.body.email;
      let result = await User.find({ email: email });
  
      return result;
      
  
    } catch (err) {
      console.log("big error catch")
      return err;
    }
  };

  exports.login = async function (req, res) {
    try {
      // console.log(req.body);
      const email = req.body.email;
      const redditEmail = req.body.socEmail;
      const redditPassword = req.body.socPassword;
      //console.log("In Login");
      // let result = await User.find({ email: email });
      //TODO use reddit api to verify user

      link = "https://www.reddit.com/api/v1/authorize?client_id=9Hu_S9TRq-MdOuPUvYe3Vw&response_type=code&state=" + randomString + 
      "&redirect_uri=http://127.0.0.1:3000/dashboard&duration=temporary&scope=subscribe,vote,mysubreddits,save,read,privatemessages,identity,account,history"

      console.log(link);

      let result = await User.findOneAndUpdate(
        {"email": email}, 
        {"redditUsername": redditEmail, "redditPassword": redditPassword},
        );
      return result;
      
  
    } catch (err) {
      console.log("big error catch")
      return err;
    }
  };