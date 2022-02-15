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

