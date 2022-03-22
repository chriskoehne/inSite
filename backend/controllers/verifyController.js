const c = require('../constants/constants');

var verifyService = require('../services/verifyService');

const generateToken = require('../auth/authentication').generateToken;

exports.verify = async function (req, res, next) {
  try {
    /* FOR DEVELOPMENT ONLY */
    let result = c.SUCCESS;

    /* UNCOMMENT THIS */
    // let result = await verifyService.check(req.body.email, req.body.code);

    switch (result) {
      case c.USER_NOT_FOUND:
      case c.AUTHY_VERIFY_ERROR:
      case c.GENERAL_TRY_CATCH_ERR:
        return res.status(400).json({ message: result });
        break;
    }

    generateToken(result.user.id, result.user.email, res);
    return res.status(200).json({ user: result.user });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: e.message });
  }
};
