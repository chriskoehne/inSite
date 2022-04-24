const c = require('../constants/constants');
const mongoose = require('mongoose')

var userService = require('../services/userService');

const generateToken = require('../auth/authentication').generateToken;

exports.userCreation = async function (req, res, next) {
  // console.log('userCreation')
  try {
    let result = await userService.signup(
      req.body.email,
      req.body.password,
    );
    // console.log('in controller, result is');
    // console.log(result);

    switch (result) {
      case c.USER_NOT_FOUND:
      case c.USER_CREATION_ERR:
      case c.EMAIL_TAKEN:
      case c.GENERAL_TRY_CATCH_ERR:
        return res.status(400).json({ message: result });
        break;
      default:
        //success
        // console.log('should be success controller');
        return res.status(200).json({ message: result }); //should be the user's id
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.deleteUser = async function (req, res, next) {
  // console.log('delete')
  try {
    let result = await userService.deleteUser(req.body.email);
    return res.status(200).json({ message: result });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.login = async function (req, res, next) {
  // console.log('login')

  try {
    /* FOR DEVELOPMENT ONLY */
    // let result = '620f3de16decd5056284765d';

    /* UNCOMMENT THIS */
    let result = await userService.check(req.body.email, req.body.password, req.body.secret);

    switch (result) {
      case c.USER_NOT_FOUND:
      case c.INCORRECT_PASSWORD:
      case c.INVALID_SECRET_ERR:
      case c.GENERAL_TRY_CATCH_ERR:
        return res.status(400).json({ message: result });
    }
    if (!mongoose.isValidObjectId(result.id)) {
      return res.status(400).json({ message: result.message });
    }
    //success
    generateToken(result.id, result.email, res);
    return res.status(200).json({ user: result }); //should be the user's id
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: e.message });
  }
};

exports.updateDarkMode = async function (req, res, next) {
  // console.log('updateDarkMode')

  try {
    let result = await userService.updateDarkMode(
      req.body.email,
      req.body.darkMode
    );
    if (result === c.SUCCESS) {
      return res.status(200).json({ message: result });
    }
    return res.status(400).json({ message: result });

  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.updateToolTips = async function (req, res, next) {
  // console.log('updateToolTip')

  try {
    let result = await userService.updateToolTips(
      req.body.email,
      req.body.toolTips
    );
    if (result === c.SUCCESS) {
      return res.status(200).json({ message: result });
    }
    return res.status(400).json({ message: result });

  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.updateCardOrder = async function (req, res, next) {
  // console.log('updateCardOrder')
  try {
    let result = await userService.updateCardOrder(
      req.body.email,
      req.body.cardOrder
    );
    if (result === c.SUCCESS) {
      return res.status(200).json({ message: result });
    }
    return res.status(400).json({ message: result });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.updatePermissions = async function (req, res, next) {
  // console.log('updatePermissions')
  try {
    let result = await userService.updatePermissions(
      req.body.email,
      req.body.permissions
    );
    if (result === c.SUCCESS) {
      return res.status(200).json({ message: result });
    }
    return res.status(400).json({ message: result });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.updateRedditData = async function (req, res, next) {
  // console.log('updateRedditData')
  try {
    let result = await userService.updateRedditData(
      req.body.email,
      req.body.property,
      req.body.data
    );
    if (result === c.SUCCESS) {
      return res.status(200).json({ message: result });
    }
    return res.status(400).json({ message: result });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.getRedditData = async function (req, res, next) {
  // console.log('getRedditData')
  try {

    let result = await userService.getRedditData(
      req.query.email,
    );
    switch (result) {
      case c.USER_INVALID_PERMISSIONS:
      case c.USER_NOT_FOUND:
      case c.GENERAL_TRY_CATCH_ERR:
        return res.status(400).json({ message: result });
    }

    return res.status(200).json({ message: result });
      
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.revokeAccess = async function (req, res, next) {
  // console.log('getRedditData')
  try {

    let result = await userService.revokeAccess(
      req.query.email,
      req.query.social
    );

    return res.status(200).json({ success: result });
          
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};
