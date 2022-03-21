const path = require('path');
const bcrypt = require('bcrypt');
const config = require('../config.json');
const c = require('../constants/constants');
const authToken = process.env.TWILIO_AUTH_TOKEN || config.TWILIO_AUTH_TOKEN;
var authy = require('authy')(authToken);


const User = require('../database/models/User');
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
