/**
 * @fileoverview The service for uploading images to Cloudinary
 * @author Chris Koehne <cdkoehne@gmail.com>
 */

const c = require('../constants/constants');
const config = require('../config.json');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryAPIKey,
  api_secret: config.cloudinaryAPISecret,
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
