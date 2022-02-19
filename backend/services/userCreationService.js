const path = require('path');
const bcrypt = require('bcrypt');
const c = require('../constants/constants');

const config = require(path.resolve(__dirname, '../config.json'));
const authToken = config.TwilioAuthToken;

var authy = require('authy')(authToken);

const User = require(path.resolve(__dirname, '../database/models/user'));
exports.signup = async function (email, password, phone) {
  try {
    if ((await User.find({ email: email })).length > 0) {
      console.log(c.EMAIL_TAKEN)
      return c.EMAIL_TAKEN;
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    let result = await User.create({
      email: email,
      password: hashedPassword,
    });

    if (!(result instanceof User)) {
      console.log('failed to create user');
      return c.USER_CREATION_ERR;
    }

    //TODO: test this works later
    return await new Promise((resolve) => {
      authy.register_user(email, phone, async function (err, regres) {
        if (!regres || err) {
          console.log(err);
          resolve(c.AUTHY_REGISTER_ERR); //reject?
        } else {
          let result = await User.findOneAndUpdate(
            { email: email },
            { authyId: regres.user.id }
          );
          return await new Promise((resolve) => {
            authy.request_sms(regres.user.id, function (err, smsres) {
              if (err) {
                console.log(err);
                resolve(c.AUTHY_REQUEST_SMS_ERR);
              }
              console.log('sent user code');
              console.log(smsres.message);
              resolve(result.id); //should use a constant for this?
            });
          });
        }
      });
    });

  } catch (err) {
    console.log(err.message);
    return c.GENERAL_TRY_CATCH_ERR;
  }
};
