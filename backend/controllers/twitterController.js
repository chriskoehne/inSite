var twitterService = require('../services/twitterService');

exports.login = async function(req, res, next) {
  try {
    // console.log('In Twitter Login Controller');
    let result = await twitterService.login(req.body.email);
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

exports.check = async function (req, res, next) {
  try {
    // console.log('In Reddit Login Controller');
    let result = await twitterService.check(req.body.params.email); 
    
    if (result) {
      return res.status(200).json({
        success: true,
        twitter: result
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
    // console.log('In Twitter Convert Controller');
    let result = await twitterService.convert(req, res);

    if (result) {
      return res
        .status(200)
        .json({ success: true, accessToken: result.access_token });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.test = async function (req, res, next) {
  try {
    // console.log('In Twitter Test Controller');
    let result = await twitterService.test(req, res);

    if (result) {
      return res
        .status(200)
        .json({ success: true, data: result.data });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.tweetCount = async function (req, res, next) {
  try {
    // console.log('In Twitter Test Controller');
    let result = await twitterService.tweetCount(req, res);

    if (result) {
      return res
        .status(200)
        .json({ success: true, data: result.data });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.me = async function (req, res, next) {
  try {
    // console.log('In Twitter Test Controller');
    let result = await twitterService.me(req, res);

    if (result) {
      return res
        .status(200)
        .json({ success: true, data: result.data });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.tweets = async function (req, res, next) {
  try {
    // console.log('In Twitter Test Controller');
    let result = await twitterService.tweets(req, res);

    if (result) {
      return res
        .status(200)
        .json({ success: true, data: result.data });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.followers = async function (req, res, next) {
  try {
    // console.log('In Twitter Followers Controller');
    let result = await twitterService.followers(req, res);

    if (result) {
      return res
        .status(200)
        .json({ success: true, data: result.data });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.following = async function (req, res, next) {
  try {
    // console.log('In Twitter Following Controller');
    let result = await twitterService.following(req, res);

    if (result) {
      return res
        .status(200)
        .json({ success: true, data: result.data });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.likes = async function (req, res, next) {
  try {
    // console.log('In Twitter Likes Controller');
    let result = await twitterService.likes(req, res);

    if (result) {
      return res
        .status(200)
        .json({ success: true, data: result.data });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.tweetLikes = async function (req, res, next) {
  try {
    // console.log('In Twitter Tweet Likes Controller');
    let result = await twitterService.tweetLikes(req, res);

    if (result) {
      return res
        .status(200)
        .json({ success: true, data: result.data });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.followMetrics = async function (req, res, next) {
  try {
    // console.log('In Twitter Tweet Follow Metrics Controller');
    let result = await twitterService.followMetrics(req, res);

    if (result) {
      return res
        .status(200)
        .json({ success: true, data: result.data });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};


