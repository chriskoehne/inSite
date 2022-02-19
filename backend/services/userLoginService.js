const path = require('path');
const bcrypt = require('bcrypt');
const config = require(path.resolve(__dirname, '../config.json'));
const c = require('../constants/constants');
const authToken = config.TwilioAuthToken;
var authy = require('authy')(authToken);


const User = require(path.resolve(__dirname, '../database/models/user'));
exports.check = async function (email, password) {
  try {

    let result = await User.findOne({
      email: email,
    });
    if (!result) {
      return c.USER_NOT_FOUND;
    }

    if (! await bcrypt.compare(password, result.password)) {
      return c.INCORRECT_PASSWORD
    }

    return await new Promise((resolve) => {
      authy.request_sms(result.authyId, function (err, authyres) {
        if (!authyres || err) {
          console.log(err);
          resolve(c.AUTHY_REQUEST_SMS_ERR); //reject?
        } else {
          console.log(authyres.message);
          resolve(result.id);
        }
      });
    });


  } catch (err) {
    return c.GENERAL_TRY_CATCH_ERR;
  }
};
