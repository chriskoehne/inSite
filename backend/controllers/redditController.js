const path = require("path");

var redditService = require(path.resolve(
  __dirname,
  "../services/redditService"
));

exports.login = async function (req, res, next) {
  try {
    let result = await redditService.login(req, res); //add await?
    //two fields
    if (result.link) {
      return res.status(200).json({ status: 200, success: true, link: result.link, verificationString: result.verificationString });
    } else {
      return res.status(200).json({ status: 200, success: false });
    }
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.convert = async function (req, res, next) {
  try {
    let result = await redditService.convert(req, res); //add await?
    //two fields
    if (result) {
      return res.status(200).json({ status: 200, success: true, accessToken: result.access_token });
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

