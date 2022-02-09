const path = require('path');

var userCreationService = require(path.resolve(__dirname, '../services/userCreationService'));

exports.userCreation = async function (req, res, next) {
    try {
      let result = await userCreationService.signup(req, res);
      res.status(200).json(result);
    } catch (e) {
      return res.status(400).json({ status: 400, message: e.message });
    }
  };