const path = require('path');

var loginService = require(path.resolve(__dirname, '../services/userLoginService'));

exports.login = async function (req, res, next) {
    try {
      console.log("in login controller")
      let result = await loginService.check(req, res);
      res.status(200).json(result);
    } catch (e) {
      return res.status(400).json({ status: 400, message: e.message });
    }
  };