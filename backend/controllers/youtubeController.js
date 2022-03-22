const path = require('path');
const c = require('../constants/constants');

var youtubeService = require(path.resolve(
  __dirname,
  '../services/youtubeService'
));

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