const c = require('../constants/constants');
const authToken = process.env.TWILIO_AUTH_TOKEN;
var authy = require('authy')(authToken);

const User = require('../database/models/User');
exports.check = async function (email, code) {
  try {
    // console.log(email);
    let user = await User.findOne({ email: email }).select('-password -__v');

    if (!user) {
      return c.USER_NOT_FOUND;
    }
    // console.log('user is');
    // console.log(user);
    return new Promise((resolve) => {
      authy.verify(
        user.authyId,
        (token = code),
        (force = false),
        function (err, authyres) {
          if (!authyres || err) {
            console.log('error caught');
            // res.status(400).send({ message: "invalid code" });
            resolve(c.AUTHY_VERIFY_ERROR);
          } else {
            console.log(authyres);

            // should redo this by removing them from the mongo query
            const safeUser = {
              _id: user._id,
              email: user.email,
              settings: user.settings,
              //add other wanted properties here
            };
            console.log(safeUser);
            resolve({ user: safeUser });
          }
        }
      );
    });
  } catch (err) {
    console.log('big error catch');
    return c.GENERAL_TRY_CATCH_ERR;
  }
};
