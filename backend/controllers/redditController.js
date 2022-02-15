const path = require("path");

var redditService = require(path.resolve(
  __dirname,
  "../services/redditService"
));

exports.login = async function (req, res, next) {
  try {
    let result = await redditService.login(req, res); //add await?
    // if (result.redditUsername) {
    //   return res.status(200).json({ status: 200, success: true });
    // } else {
    //   return res.status(200).json({ status: 200, success: false });
    // }
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.getUser = async function (req, res, next) {
    try {
      let result = await redditService.getUser(req, res); //add await?
      if (result.redditUsername) {
        return res.status(200).json({ status: 200, success: true });
      } else {
        return res.status(200).json({ status: 200, success: false });
      }
    } catch (e) {
      return res.status(400).json({ status: 400, message: e.message });
    }
  };

exports.test = async function (req, res, next) {
  try {
    let result = await redditService.test(req, res); //add await?
    console.log("controller");
    console.log(result);
    return;
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

