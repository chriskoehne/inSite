const c = require('../constants/constants');

var redditService = require('../services/redditService');

exports.login = async function (req, res, next) {
  try {
    let result = await redditService.login(req.body.email); //add await?
    //two fields
    if (result.link) {
      return res.status(200).json({
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
    console.log("controller, getting username");
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
    console.log('controller, getting overview');
    let result = await redditService.userOverview(req, res); //add await?
    //two fields
    // console.log("in controller")
    // console.log("Overview Info")
    // console.log(result.data)
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
            break;
          case c.MESSAGE:
            messages.push(item.data);
            break;
          case c.LINK:
            posts.push(item.data);
        }
      });
      // console.log(array)
      return res.status(200).json({
        posts: posts,
        comments: comments,
        messages: messages,
      }); //only returns name for now
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.userComments = async function (req, res, next) {
  try {
    console.log('controller, getting comments');
    let result = await redditService.userComments(req, res);
    if (result) {
      return res.status(200).json({ success: true, overview: result });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.userSubKarma = async function (req, res, next) {
  try {
    console.log("controller, getting Sub Karma");
    let result = await redditService.userSubKarma(req, res); //add await?

    // console.log("Subreddit Karma");
    // console.log(result.data);

    // var scores = {};
    // for (item in result.data) {
    //   // console.log(result.data[item].sr);
    //   scores[result.data[item].sr] = result.data[item].comment_karma + result.data[item].link_karma;
    // }
    
    // console.log(scores);

    // var sort_items = Object.keys(scores).map(function(key) {
    //   return [key, scores[key]];
    // });

    // sort_items.sort(function(first, second) {
    //   return second[1] - first[1];
    // });

    // console.log(items.slice(0, 5));

    if (result) {
      return res
        .status(200)
        .json({
          success: true,
          subKarmaList: result.data.slice(0, 5)
        }); 
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.userTotalKarma = async function (req, res, next) {
  try {
    console.log("controller, getting Total Karma");
    let result = await redditService.userTotalKarma(req, res); //add await?

    // console.log("Comment Karma: " + result.data.comment_karma);
    // console.log("Link Karma: " + result.data.link_karma);
    // console.log("Award Karma: " + result.data.awardee_karma);
      
    if (result) {
      return res
        .status(200)
        .json({
          success: true,
          commentKarma: result.data.comment_karma,
          linkKarma: result.data.link_karma,
          awardKarma: result.data.awardee_karma,
          totalKarma: result.data.total_karma
        }); 
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};