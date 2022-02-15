const path = require("path");
const bcrypt = require("bcrypt");
const Reddit = require('reddit')
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
      // let result = await User.find({ email: email });
      //TODO use reddit api to verify user
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