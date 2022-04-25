var twitchService = require('../services/twitchService');

exports.login = async function(req, res, next) {
  try {
    // console.log('In Twitch Login Controller');
    let result = await twitchService.login(req.body.email);
    if (result.link) {
      return res.status(200).json({
        success: true,
        link: result.link,
        verificationString: result.verificationString,
      });
    } else {
      return res.status(200).json({ success: false });
    }
  } catch(e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.convert = async function (req, res, next) {
  try {
    // console.log('In Twitch Convert Controller');
    let result = await twitchService.convert(req, res);

    if (result) {
      return res
        .status(200)
        .json({ success: true, accessToken: result.access_token, refreshToken: result.refresh_token, expiries: result.expires_in });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.check = async function (req, res, next) {
  try {
    // console.log('In Twitch Check Controller');
    let result = await twitchService.check(req.body.params.email); 
    
    if (result) {
      return res.status(200).json({
        success: true,
        twitch: result
      });
    } else {
      return res.status(200).json({ success: false });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.getUser = async function (req, res, next) {
  try {
    // console.log('In Twitch User Controller');
    let result = await twitchService.getUser(req, res); 
    
    if (result) {
      return res
        .status(200)
        .json({ success: true, data: result.data });
    } else {
      return res.status(200).json({ success: false });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};