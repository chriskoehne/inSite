/**
 * @fileoverview The controller for uploading images to Cloudinary
 * @author Chris Koehne <cdkoehne@gmail.com>
 */

const uploadService = require('../services/uploadService');
const c = require('../constants/constants')

exports.upload = async function (req, res, next) {
  try {
    let result = await uploadService.upload(req.body.image);

    switch (result) {
      case c.CLOUDINARY_ERROR:
        return res.status(400).json({ message: result });
      case c.GENERAL_TRY_CATCH_ERR:
        return res.status(400).json({ message: result });
      default:
        //success
        return res.status(200).json({ message: result }); //should be the user's id
    }
  } catch (e) {
    console.log(e)
    return res.status(400).json({ message: e.message });
  }
};
