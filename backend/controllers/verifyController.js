const path = require('path');
const c = require('../constants/constants');

var verifyService = require(path.resolve(
  __dirname,
  '../services/verifyService'
));

const generateToken = require('../auth/authentication').generateToken;

exports.verify = async function (req, res, next) {
  try {
    // let result = await verifyService.check(req.body.email, req.body.code);
    let result = c.SUCCESS;

    switch (result) {
      case c.USER_NOT_FOUND:
      case c.AUTHY_VERIFY_ERROR:
      case c.GENERAL_TRY_CATCH_ERR:
        return res.status(400).json({ message: result });
    }

    generateToken(req.body.id, req.body.email, res);
    return res.status(200).json({ message: result.message });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: e.message });
  }
};
