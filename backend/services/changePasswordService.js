const path = require('path');
const bcrypt = require('bcrypt');
const config = require(path.resolve(__dirname, '../config.json'));
const c = require('../constants/constants');
const authToken = config.TwilioAuthToken;
var authy = require('authy')(authToken);


const User = require(path.resolve(__dirname, '../database/models/user'));
exports.check = async function (email, oldPassword, newPassword1, newPassword2) {
  try {
    console.log("Updating user for email %s", email);
    console.log("Updating user for Old password: %s", oldPassword);
    console.log("Updating user for New password 1: %s", newPassword1);

    let result = await User.findOne({
      email: email,
    });
    if (!result) {
      return c.USER_NOT_FOUND;
    }

    if (!await newPassword1.compare(newPassword2)) {
      return c.PASSWORDS_MISMATCH;
    }

    if (! await bcrypt.compare(oldPassword, result.password)) {
      return c.INCORRECT_PASSWORD;
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword1, salt);
    

    result = await User.update({
      email: email,
      password: hashedPassword,
    });


  } catch (err) {
    return c.GENERAL_TRY_CATCH_ERR;
  }
};
