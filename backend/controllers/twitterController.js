const path = require('path');

var twitterService = require(path.resolve(
  __dirname,
  '../services/twitterService'
));

exports.login = async function(req, res, next) {
  try {
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

