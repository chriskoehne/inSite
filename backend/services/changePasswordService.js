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
    console.log("Updating user for New password 2: %s", newPassword2);

    let result = await User.findOne({
      email: email,
    });
    if (!result) {
      return c.USER_NOT_FOUND;
    }

    if (! await bcrypt.compare(oldPassword, result.password)) {
      console.log("Wrong Password!");
      return c.INCORRECT_PASSWORD;
    }

    if (!(newPassword1===newPassword2)) {
      console.log("Passwords mismatch!");
      return c.PASSWORDS_MISMATCH;
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword1, salt);
    

    result = await User.updateOne(
      { email: email },
      { $set: { password: hashedPassword } }
    );
      
    result = c.PASSWORD_CHANGE_SUCCESS;

  } catch (err) {
    return c.GENERAL_TRY_CATCH_ERR;
  }
};
