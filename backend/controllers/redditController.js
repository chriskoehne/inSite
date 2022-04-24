const c = require('../constants/constants');

var redditService = require('../services/redditService');

exports.login = async function (req, res, next) {
  try {
    // console.log('In Reddit Login Controller');
    let result = await redditService.login(req.body.email);

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

exports.check = async function (req, res, next) {
  try {
    // console.log('In Reddit Login Controller');
    let result = await redditService.check(req.body.params.email);

    if (result) {
      return res.status(200).json({
        success: true,
        reddit: result,
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
    // console.log('In Reddit Convert Controller');
    let result = await redditService.convert(req.body.code, req.body.email);

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
    // console.log("In Reddit Me Controller");
    let result = await redditService.redditMe(req, res);

    if (result) {
      return res.status(200).json({ success: true, name: result.name }); //only returns name for now
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.userOverview = async function (req, res, next) {
  try {
    // console.log('In Reddit Overview Controller');
    const email = req.query.email;
    const token = req.query.accessToken;
    const username = req.query.username;

    let result = await redditService.userOverview(token, username);

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

      const data = {
        posts: posts,
        comments: comments,
        messages: messages,
      };

      await redditService.updateRedditData(email, 'overview', data);
      return res.status(200).json(data);
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

// we don't use this i think
exports.userComments = async function (req, res, next) {
  try {
    // console.log('In Reddit Comments Controller')
    const token = req.query.accessToken;
    const username = req.query.username;
    let result = await redditService.userComments(token, username);
    if (result) {
      return res.status(200).json({ success: true, overview: result });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.userSubKarma = async function (req, res, next) {
  try {
    console.log('In Reddit Sub Karma Controller');
    const email = req.query.email;
    const token = req.query.accessToken;
    let result = await redditService.userSubKarma(token);

    if (result) {
      const subKarmaList = result.data.slice(0, 5);

      await redditService.updateRedditData(email, 'subKarma', subKarmaList);
      return res.status(200).json({
        success: true,
        subKarmaList: subKarmaList,
      });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.userTotalKarma = async function (req, res, next) {
  try {
    // console.log("In Reddit Total Karma Controller");
    const email = req.query.email;
    const token = req.query.accessToken;
    const username = req.query.username;
    let result = await redditService.userTotalKarma(token, username);

    if (result) {
      const totalKarma = {
        commentKarma: result.data.comment_karma,
        linkKarma: result.data.link_karma,
        awardKarma: result.data.awardee_karma,
        totalKarma: result.data.total_karma,
      };
      await redditService.updateRedditData(email, 'totalKarma', totalKarma);

      return res.status(200).json(totalKarma);
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};
