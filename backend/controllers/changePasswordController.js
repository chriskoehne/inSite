
const c = require('../constants/constants');

var changePasswordService = require('../services/changePasswordService');

exports.checkPasswd = async function (req, res, next) {
  try {
    /* FOR DEVELOPMENT ONLY */
    //let result = '620f3de16decd5056284765d';

    let result = await changePasswordService.check(req.body.email, req.body.oldPassword, req.body.newPassword);

    return res.status(200).json({ message: result }); //should be the user's id
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: result });
  }
};
