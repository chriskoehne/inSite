const c = require('../constants/constants');

var loginService = require('../services/userLoginService');

exports.login = async function (req, res, next) {
  try {
    /* FOR DEVELOPMENT ONLY */
    let result = '620f3de16decd5056284765d';

    /* UNCOMMENT THIS */
    // let result = await loginService.check(req.body.email, req.body.password);

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
