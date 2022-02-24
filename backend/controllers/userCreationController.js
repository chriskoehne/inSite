const path = require('path');
const c = require('../constants/constants');

var userCreationService = require(path.resolve(
  __dirname,
  '../services/userCreationService'
));

exports.userCreation = async function (req, res, next) {
  try {
    let result = await userCreationService.signup(
      req.body.email,
      req.body.password,
      req.body.phone
    );

    switch (result) {
      case c.AUTHY_REGISTER_ERR:
      case c.AUTHY_REQUEST_SMS_ERR:
      case c.USER_NOT_FOUND:
      case c.USER_CREATION_ERR:
      case c.EMAIL_TAKEN:
      case c.GENERAL_TRY_CATCH_ERR:
        return res.status(400).json({ message: result });
        break;
      default:
        //success
        return res.status(200).json({ message: result }); //should be the user's id
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};
