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

exports.convert = async function (req, res, next) {
  try {
    // console.log('In YouTube Convert Controller');
    let result = await youtubeService.convert(req, res); 
    
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
    // console.log('In YouTube Activity Controller');
    let result = await youtubeService.activity(req, res);
    
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
    let result = await youtubeService.likedVideos(req, res);
    
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
    let result = await youtubeService.playlists(req, res);
    
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
    let result = await youtubeService.popularVidsFromLiked(req, res);
    
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
    let result = await youtubeService.subscriptions(req, res); 

    if (result) {
      return res
        .status(200)
        .json({ success: true, list: result.items });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.channelInfo = async function (req, res, next) {
  try {
    console.log('In YouTube CHANNEL INFO Controller');
    let result = await youtubeService.channelInfo(req, res); 

    if (result) {
      return res
        .status(200)
        .json({ success: true, list: result.items });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.videoList = async function (req, res, next) {
  try {
    console.log('In YouTube VIDEO LIST Controller');
    let result = await youtubeService.videoList(req, res); 

    if (result) {
      return res
        .status(200)
        .json({ success: true, list: result.items });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.myPopularVids = async function (req, res, next) {
  try {
    console.log('In YouTube MY POPULAR VIDS Controller');
    let result = await youtubeService.myPopularVids(req, res); 

    if (result) {
      return res
        .status(200)
        .json({ success: true, list: result.items });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.mySubscribers = async function (req, res, next) {
  try {
    console.log('In YouTube MY SUBSCRIBERS Controller');
    let result = await youtubeService.mySubscribers(req, res); 

    if (result) {
      return res
        .status(200)
        .json({ success: true, list: result.items });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.myPopularCat = async function (req, res, next) {
  try {
    console.log('In YouTube MY POPULAR CATEGORIES Controller');
    let result = await youtubeService.myPopularCat(req, res); 

    if (result) {
      return res
        .status(200)
        .json({ success: true, list: result.items });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.myVidCats = async function (req, res, next) {
  try {
    console.log('In YouTube MY VIDCATS Controller');
    let result = await youtubeService.myVidCats(req, res); 

    if (result) {
      return res
        .status(200)
        .json({ success: true, list: result.items });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.myVidComments = async function (req, res, next) {
  try {
    console.log('In YouTube MY VIDCOMMENTS Controller');
    let result = await youtubeService.myVidComments(req, res); 

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
    let result = await youtubeService.mostSubscribers(req, res); 

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
    let result = await youtubeService.popularLikedVideos(req, res);
    
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
    let result = await youtubeService.popularCategory(req, res);
    
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
    let result = await youtubeService.popularComments(req, res);
    
    if (result) {
      return res
        .status(200)
        .json({ success: true, list: result.items });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }

};

