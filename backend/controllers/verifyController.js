const path = require('path');

var verifyService = require(path.resolve(__dirname, '../services/verifyService'));

exports.verify = async function (req, res, next) {
    try {
      let result = await verifyService.check(req, res);
      res.status(200).json(result);
    } catch (e) {
      return res.status(400).json({ status: 400, message: e.message });
    }
  };