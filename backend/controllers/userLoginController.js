const path = require('path');
const c = require('../constants/constants');

var loginService = require(path.resolve(
  __dirname,
  '../services/userLoginService'
));

exports.login = async function (req, res, next) {
  try {
    // let result = await loginService.check(req.body.email, req.body.password);
    // console.log(result)
    let result = '620f3de16decd5056284765d';

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
    return res.status(400).json({ status: 400, message: e.message });
  }
};
