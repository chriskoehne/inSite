/**
 * @fileoverview The service for uploading images to Cloudinary
 * @author Chris Koehne <cdkoehne@gmail.com>
 */

const c = require('../constants/constants');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.upload = async (image) => {
  try {
    const result = await cloudinary.v2.uploader.upload(image);
    if (!result || !result.secure_url) {
      return c.CLOUDINARY_ERROR;
    }
    return result.secure_url;
  } catch (err) {
    console.log(err.message);
    return c.GENERAL_TRY_CATCH_ERR;
  }
};
