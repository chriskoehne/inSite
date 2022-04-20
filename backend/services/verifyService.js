const c = require('../constants/constants');
const authToken = process.env.TWILIO_AUTH_TOKEN;
const speakeasy = require("speakeasy");


const User = require('../database/models/User');
const { userCreation } = require('../controllers/userController');
exports.check = async function (email, code) {
  try {
    // console.log(email);
    let user = await User.findOne({ email: email }).select('-password -__v');

    if (!user) {
      return c.USER_NOT_FOUND;
    }
    const verified = speakeasy.totp.verify({ secret: user.mfaSecret.base32,
      encoding: 'base32',
      token: code });
    const safeUser = {
        id: user._id,
        email: user.email,
        settings: user.settings,
        mfaSecret: user.mfaSecret,
        verified: verified
        //add other wanted properties here
      };
    return safeUser;
    
  } catch (err) {
    console.log('big error catch');
    return c.GENERAL_TRY_CATCH_ERR;
  }
};
