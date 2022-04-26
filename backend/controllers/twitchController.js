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

exports.getUserFollows = async function (req, res, next) {
  try {
    // console.log('In Twitch User Follows Controller');
    let result = await twitchService.getUserFollows(req, res); 
    
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

exports.getCreatorGoals = async function (req, res, next) {
  try {
    // console.log('In Twitch Creator Goals Controller');
    let result = await twitchService.getCreatorGoals(req, res); 
    
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

exports.getStreamTags = async function (req, res, next) {
  try {
    // console.log('In Twitch Stream Tags Controller');
    let result = await twitchService.getStreamTags(req, res); 
    
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

exports.getAutomodSettings = async function (req, res, next) {
  try {
    // console.log('In Twitch User Controller');
    let result = await twitchService.getAutomodSettings(req, res); 
    
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

exports.getChannelInformation = async function (req, res, next) {
  try {
    // console.log('In Twitch User Controller');
    let result = await twitchService.getChannelInformation(req, res); 
    
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

exports.getBannedUsers = async function (req, res, next) {
  try {
    // console.log('In Twitch User Controller');
    let result = await twitchService.getBannedUsers(req, res); 
    
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