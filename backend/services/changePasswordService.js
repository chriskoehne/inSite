const path = require('path');
const bcrypt = require('bcrypt');
const config = require(path.resolve(__dirname, '../config.json'));
const c = require('../constants/constants');


const User = require(path.resolve(__dirname, '../database/models/user'));
exports.check = async function (email, oldPassword, newPassword1, newPassword2) {
  try {

    let list = await User.find({ email: email })
    let result = list[0]

    if (!result) {
      console.log("user not found")
      return c.USER_NOT_FOUND;
    }

    if (newPassword1.localeCompare(newPassword2) !== 0) {
      console.log("password mismatch")
      return c.PASSWORDS_MISMATCH;
    }

    if (! await bcrypt.compare(oldPassword, result.password)) {
      console.log("invalid original password")
      return c.INCORRECT_PASSWORD;
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword1, salt);

    
    
    result = await User.findOneAndUpdate(
      { email: email },
      { password: hashedPassword }
    );
    
    return "Password Change Successful!";


  } catch (err) {
    return c.GENERAL_TRY_CATCH_ERR;
  }
};
