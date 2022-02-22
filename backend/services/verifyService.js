const path = require('path');
const bcrypt = require('bcrypt');
const c = require('../constants/constants');

const config = require(path.resolve(__dirname, '../config.json'));

const authToken = config.TwilioAuthToken;
var authy = require('authy')(authToken);

const User = require(path.resolve(__dirname, '../database/models/user'));
exports.check = async function (email, code) {
  try {
    console.log(email);
    let result = await User.findOne({ email: email });

    if (!result) {
      return c.USER_NOT_FOUND;
    }
    console.log('user is');
    console.log(result);
    return new Promise((resolve) => {
      authy.verify(
        result.authyId,
        (token = code),
        (force = false),
        function (err, authyres) {
          if (!authyres || err) {
            console.log('error caught');
            // res.status(400).send({ message: "invalid code" });
            resolve(c.AUTHY_VERIFY_ERROR);
          } else {
            console.log(authyres);
            resolve(c.SUCCESS);
          }
        }
      );
    });
  } catch (err) {
    console.log('big error catch');
    return c.GENERAL_TRY_CATCH_ERR;
  }
};
