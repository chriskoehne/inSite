const path = require('path');
const bcrypt = require('bcrypt');
const c = require('../constants/constants');

const config = require('../config.json');
const authToken = process.env.TWILIO_AUTH_TOKEN || config.TWILIO_AUTH_TOKEN;

var authy = require('authy')(authToken);

const User = require('../database/models/User');
exports.signup = async function (email, password, phone) {
  try {
    if ((await User.find({ email: email })).length > 0) {
      console.log(c.EMAIL_TAKEN);
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
          await authy.request_sms(regres.user.id, function (err, smsres) {
            if (err) {
              console.log(err);
              resolve(c.AUTHY_REQUEST_SMS_ERR);
            }
            console.log('sent user code');
            console.log(smsres);
            console.log(result);
            resolve(result.id); //should use a constant for this?
          });
        }
      });
    });
  } catch (err) {
    console.log(err.message);
    return c.GENERAL_TRY_CATCH_ERR;
  }
};

exports.deleteUser = async function (email) {
  try {
    console.log('deleting user');
    let user = await User.findOne({ email: email });
    let authyId = user.authyId;
    let deleted = await User.remove({ _id: user._id });

    return await new Promise((resolve) => {
      authy.delete_user(authyId, function (err, res) {
        if (err) {
          resolve({ deleted, err });
        } else {
          console.log('success');
          resolve(deleted, res);
        }
      });
    });
  } catch (err) {
    console.log(err.message);
    return c.GENERAL_TRY_CATCH_ERR;
  }
};
