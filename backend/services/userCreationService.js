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

    // return await new Promise((resolve) => {
    //   authy.request_sms(result.authyId, function (err, authyres) {
    //     if (!authyres || err) {
    //       console.log(err);
    //       resolve(c.AUTHY_REQUEST_SMS_ERR); //reject?
    //     } else {
    //       console.log(authyres.message);
    //       resolve(result.id);
    //     }
    //   });
    // });
    console.log('user registered successfully');

    const answer = authy.register_user(
      email,
      phone,
      async function (err, regres) {
        if (err) {
          console.log(err);
          return AUTHY_REGISTER_ERR;
        }
        console.log('made twilio user');
        let result = await User.findOneAndUpdate(
          { email: email },
          { authyId: regres.user.id }
        ); //TODO: error handle this
        //error handle result here please
        return authy.request_sms(regres.user.id, function (err, smsres) {
          if (err) {
            console.log(err);
            return c.AUTHY_REQUEST_SMS_ERR;
          }
          console.log('sent user code');
          console.log(smsres.message);
          return result.id; //should use a constant for this
        });
      }
    );

    return answer; //this is wrong, do the other thing
  } catch (err) {
    console.log(err.message);
    return c.GENERAL_TRY_CATCH_ERR;
  }
};
