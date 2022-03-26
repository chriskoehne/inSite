const c = require('../constants/constants');

var youtubeService = require('../services/youtubeService');

exports.login = async function (req, res, next) {
  try {
    let result = await youtubeService.login(req.body.email); //add await?
    
    if (result.link) {
        return res.status(200).json({
          success: true,
          link: result.link,
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
    let result = await youtubeService.convert(req, res); //add await?
    //two fields
    if (result) {
      return res
        .status(200)
        .json({ success: true, accessToken: result.access_token, refreshToken: result.refresh_token });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.activity = async function (req, res, next) {
  try {
    let result = await youtubeService.activity(req, res); //add await?
    //two fields
    if (result) {
      return res
        .status(200)
        .json({ success: true, list: result.items });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.subscriptions = async function (req, res, next) {
  try {
    let result = await youtubeService.subscriptions(req, res); //add await?
    //two fields
    if (result) {
      return res
        .status(200)
        .json({ success: true, list: result.items });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};