const bcrypt = require('bcrypt');
const c = require('../constants/constants');
const authToken = process.env.TWILIO_AUTH_TOKEN;
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

exports.check = async function (email, password) {
  try {
    let result = await User.findOne({
      email: email,
    });
    if (!result) {
      return c.USER_NOT_FOUND;
    }

    if (!(await bcrypt.compare(password, result.password))) {
      return c.INCORRECT_PASSWORD;
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

exports.updateDarkmode = async function (email, darkmode) {
  try {
    const filter = { email: email };
    const update = { darkmode: darkmode };
    let result = await User.findOneAndUpdate(filter, update);
    if (result === null || result === undefined) {
      return c.USER_FIND_AND_UPDATE_ERR;
    }
    return c.SUCCESS;
  } catch (err) {
    return c.GENERAL_TRY_CATCH_ERR;
  }
};
