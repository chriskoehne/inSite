const path = require("path");
const c = require('../constants/constants');

var redditService = require(path.resolve(
  __dirname,
  "../services/redditService"
));

exports.login = async function (req, res, next) {
  try {
    let result = await redditService.login(req, res); //add await?
    //two fields
    if (result.link) {
      return res
        .status(200)
        .json({
          success: true,
          link: result.link,
          verificationString: result.verificationString,
        });
    } else {
      return res.status(200).json({ success: false });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.convert = async function (req, res, next) {
  try {
    let result = await redditService.convert(req, res); //add await?
    //two fields
    if (result) {
      return res
        .status(200)
        .json({ success: true, accessToken: result.access_token });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.redditMe = async function (req, res, next) {
  try {
    console.log("controller, getting subreddits");
    let result = await redditService.redditMe(req, res); //add await?
    //two fields
    // console.log("in controller")
    // console.log(result)
    if (result) {
      return res.status(200).json({ success: true, name: result.name }); //only returns name for now
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.userOverview = async function (req, res, next) {
  try {
    console.log("controller, getting overview");
    let result = await redditService.userOverview(req, res); //add await?
    //two fields
    // console.log("in controller")
    // console.log(result)
    //result.data.children - divide by kind
    var posts = [];
    var comments = [];
    var messages = [];
    if (result) {
      let array = result.data.children;
      array.forEach(function (item, index) {
        switch (item.kind) {
          case c.COMMENT:
            comments.push(item.data);
          case c.MESSAGE:
            messages.push(item.data);
          case c.LINK:
            posts.push(item.data);
        }
      });
      return res
        .status(200)
        .json({
          success: true,
          posts: posts,
          comments: comments,
          messages: messages,
        }); //only returns name for now
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};
