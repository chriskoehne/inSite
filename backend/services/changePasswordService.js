const path = require('path');
const bcrypt = require('bcrypt');
const config = require('../config.json');
const c = require('../constants/constants');

const User = require('../database/models/User');
exports.check = async function (email, oldPassword, newPassword) {
  try {

    let result = await User.findOne({ email: email })

    if (!result) {
      console.log("user not found")
      return c.USER_NOT_FOUND;
    }

    if (! await bcrypt.compare(oldPassword, result.password)) {
      console.log("invalid original password")
      return c.INCORRECT_PASSWORD;
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    
    result = await User.findOneAndUpdate(
      { email: email },
      { password: hashedPassword }
    );
    
    return "Password Change Successful!";


  } catch (err) {
    return c.GENERAL_TRY_CATCH_ERR;
  }
};
