const path = require("path");
const bcrypt = require("bcrypt");
const Reddit = require('reddit');
const { link } = require("fs");
const config = require(path.resolve(__dirname, "../config.json"));
const User = require(path.resolve(__dirname, "../database/models/user"));
var btoa = require('btoa');
var axios = require("axios");
const { Agent } = require("http");
var formData = require("form-data");
var searchParams = require("url-search-params");

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
      console.log("In Login");
      console.log(req.body)

      const randomString = req.body.email

      //TODO change the client_id to grab from config file
      const link = "https://www.reddit.com/api/v1/authorize?client_id=" + config.redditAppId + "&response_type=code&state=" + randomString + 
      "&redirect_uri=https://127.0.0.1:3000/dashboard/&duration=temporary&scope=subscribe,vote,mysubreddits,save,read,privatemessages,identity,account,history";

      console.log("link");
      console.log(link);

      return {link: link, verificationString: randomString};      
  
    } catch (err) {
      console.log("big error catch")
      return err;
    }
  };

  exports.convert = async function (req, res) {
    try {
      // console.log(req.body);
      console.log("in convert")
      const code = req.body.code;
      //console.log("code" + req.body.code);
      // const body = {
      //   grant_type: "authorization_code",
      //   code: code,
      //   redirect_uri: "https://127.0.0.1:3000/dashboard/"
      // }
      // var form = new formData();
      // form.set("grant_type", "authorization_code");
      // form.set("code", code);
      // form.set("redirect_uri", "https://127.0.0.1:3000/dashboard/");

      var params = new searchParams();
      params.set("grant_type", "authorization_code");
      params.set("code", code);
      params.set("redirect_uri", "https://127.0.0.1:3000/dashboard/");

      const body = params;

      console.log("doing btoa")
      //TODO FIGURE OUT CORRECT HEADER AUTHORIZATION
      const auth = btoa(config.redditAppId + ":" + config.redditSecret);
      // const auth = btoa(config.redditAppId);
      // const auth = config.redditAppId + ":" + config.redditSecret
      const finalAuth = "Basic " + auth
      console.log("Authorization is ")
      console.log(finalAuth)
      const headers = {
        "Authorization": finalAuth,
        "User-Agent": "inSite by inSite",
        "Content-Type": "application/x-www-form-urlencoded"
      }
      console.log("using this header")
      console.log(headers)
      console.log("using the following body")
      console.log(body)
      //reddit post call
      const redditRes = await axios.post("https://www.reddit.com/api/v1/access_token", body, {headers: headers});
      console.log("reddit res is")
      console.log(redditRes.data)
      //get token
      return redditRes.data;
      
  
    } catch (err) {
      console.log("big error catch")
      console.log(err)
      return err;
    }
  };