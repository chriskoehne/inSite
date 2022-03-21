const c = require('../constants/constants');

var userService = require('../services/userService');

exports.userCreation = async function (req, res, next) {
  try {
    let result = await userService.signup(
      req.body.email,
      req.body.password,
      req.body.phone
    );
    console.log('in controller, result is');
    console.log(result);

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
        console.log('should be success controller');
        return res.status(200).json({ message: result }); //should be the user's id
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.deleteUser = async function (req, res, next) {
  try {
    let result = await userService.deleteUser(req.body.email);
    return res.status(200).json({ message: result });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.login = async function (req, res, next) {
  try {
    /* FOR DEVELOPMENT ONLY */
    let result = '620f3de16decd5056284765d';

    /* UNCOMMENT THIS */
    // let result = await userService.check(req.body.email, req.body.password);

    switch (result) {
      case c.AUTHY_REQUEST_SMS_ERR:
      case c.USER_NOT_FOUND:
      case c.INCORRECT_PASSWORD:
      case c.GENERAL_TRY_CATCH_ERR:
        return res.status(400).json({ message: result });
    }
    //success
    return res.status(200).json({ message: result }); //should be the user's id
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: e.message });
  }
};

exports.updateDarkmode = async function (req, res, next) {
  try {
    let result = await userService.updateDarkmode(
      req.body.email,
      req.body.darkmode
    );
    return res.status(200).json({ message: result });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};
