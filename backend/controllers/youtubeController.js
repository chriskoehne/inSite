const c = require('../constants/constants');

var youtubeService = require('../services/youtubeService');

exports.login = async function (req, res, next) {
  try {
    // console.log('In YouTube Login Controller');
    let result = await youtubeService.login(req.body.email); 
    
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

exports.check = async function (req, res, next) {
  try {
    // console.log('In Reddit Login Controller');
    let result = await youtubeService.check(req.body.params.email); 
    
    if (result) {
      return res.status(200).json({
        success: true,
        youtube: result
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
    // console.log('In YouTube Convert Controller');
    let result = await youtubeService.convert(req, res); 
    
    if (result) {
      return res
        .status(200)
        .json({ success: true, client: result });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.activity = async function (req, res, next) {
  try {
    // console.log('In YouTube Activity Controller');
    // console.log(req.query)
    let result = await youtubeService.activity(req.query.client);
    
    if (result) {
      return res
        .status(200)
        .json({ success: true, list: result.items });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.likedVideos = async function (req, res, next) {
  try {
    // console.log('In liked vid Controller');
    // console.log(req.query)
    let result = await youtubeService.likedVideos(JSON.parse(req.query.client));
    
    if (result) {
      return res
        .status(200)
        .json({ success: true, list: result.items });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.playlists = async function (req, res, next) {
  try {
    // console.log('In YouTube playlist Controller');
    // console.log(req.query)
    // console.log(typeof req.query)
    let result = await youtubeService.playlists(req.query.client);
    
    if (result) {
      return res
        .status(200)
        .json({ success: true, list: result.items });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.popularVidsFromLiked = async function (req, res, next) {
  try {
    // console.log('In YouTube pop liked vids Controller');
    // console.log(req.query)
    let result = await youtubeService.popularVidsFromLiked(req.query.client);
    
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
    // console.log('In YouTube Subscriptions Controller');
    // console.log('In YouTube subs Controller');
    // console.log(req.query)
    let result = await youtubeService.subscriptions(JSON.parse(req.query.client)); 

    if (result) {
      return res
        .status(200)
        .json({ success: true, list: result.items });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.mostSubscribers = async function (req, res, next) {
  try {
    // console.log('In YouTube Subscriptions Controller');
    // console.log('In YouTube most subs Controller');
    // console.log(req.query)
    let result = await youtubeService.mostSubscribers(req.query.client); 

    if (result) {
      return res
        .status(200)
        .json({ success: true, list: result });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.popularLikedVideos = async function (req, res, next) {
  try {
    // console.log('In YouTube popular liked vids Controller');
    // console.log(req.query)
    let result = await youtubeService.popularLikedVideos(req.query.client);
    
    if (result) {
      return res
        .status(200)
        .json({ success: true, list: result.items });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }

};

exports.popularCategory = async function (req, res, next) {
  try {
    // console.log('In YouTube pop cat Controller');
    // console.log(req.query)
    let result = await youtubeService.popularCategory(req.query.client);
    
    if (result) {
      return res
        .status(200)
        .json({ success: true, list: result.items });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.popularComments = async function (req, res, next) {
  try {
    // console.log('In YouTube pop com Controller');
    // console.log(req.query)

    let result = await youtubeService.popularComments(req.query.client);
    
    if (result) {
      return res
        .status(200)
        .json({ success: true, list: result.items });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }

};

