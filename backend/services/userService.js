const bcrypt = require('bcrypt');
const c = require('../constants/constants');
const { findOne } = require('../database/models/User');
const speakeasy = require("speakeasy");
const authToken = process.env.TWILIO_AUTH_TOKEN;

const User = require('../database/models/User');
exports.signup = async function (email, password) {
  try {
    if ((await User.find({ email: email })).length > 0) {
      console.log(c.EMAIL_TAKEN);
      return c.EMAIL_TAKEN;
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    let result = await User.create({
      email: email,
      password: hashedPassword,
    });

    if (!(result instanceof User)) {
      console.log('failed to create user');
      return c.USER_CREATION_ERR;
    }

    const secret = await speakeasy.generateSecret();
    
    result = await User.findOneAndUpdate(
      { email: email },
      { mfaSecret: secret }
    );
    return secret
    
  } catch (err) {
    console.log(err.message);
    return c.GENERAL_TRY_CATCH_ERR;
  }
};

exports.deleteUser = async function (email) {
  try {
    console.log('deleting user');
    let user = await User.findOne({ email: email });
    let deleted = await User.remove({ _id: user._id });
    return deleted;
  } catch (err) {
    console.log(err.message);
    return c.GENERAL_TRY_CATCH_ERR;
  }
};

exports.check = async function (email, password, secret) {
  try {
    let result = await User.findOne({
      email: email,
    });
    if (!result) {
      return c.USER_NOT_FOUND;
    }

    if (!(await bcrypt.compare(password, result.password))) {
      return c.INCORRECT_PASSWORD;
    }
    const verified = speakeasy.totp.verify({ secret: result.mfaSecret.base32,
      encoding: 'base32',
      token: secret });
    console.log("verified result in login is")
    console.log(verified)
    if (verified) {
      const safeUser = {
        id: result._id,
        email: result.email,
        settings: result.settings,
        mfaSecret: result.mfaSecret,
        verified: verified
        //add other wanted properties here
      };
      return safeUser
    } else {
      return c.INVALID_SECRET_ERR
    }
    
  } catch (err) {
    console.log(err);
    return err;
  }
};

exports.updateDarkMode = async function (email, darkMode) {
  try {
    const filter = { email: email };
    const update = { 'settings.darkMode': darkMode };
    let result = await User.findOneAndUpdate(filter, update, { new: true });
    // console.log(result);
    if (result === null || result === undefined) {
      return c.USER_FIND_AND_UPDATE_ERR;
    }
    return c.SUCCESS;
  } catch (err) {
    console.log(err);
    return c.GENERAL_TRY_CATCH_ERR;
  }
};

exports.updateToolTips = async function (email, toolTips) {
  try {
    const filter = { email: email };
    const update = { 'settings.toolTips': toolTips };
    let result = await User.findOneAndUpdate(filter, update, { new: true });
    // console.log(result);
    if (result === null || result === undefined) {
      return c.USER_FIND_AND_UPDATE_ERR;
    }
    return c.SUCCESS;
  } catch (err) {
    console.log(err);
    return c.GENERAL_TRY_CATCH_ERR;
  }
};

exports.updateCardOrder = async function (email, cardOrder) {
  try {
    const filter = { email: email };
    const update = { 'settings.cardOrder': cardOrder };
    let result = await User.findOneAndUpdate(filter, update, { new: true });
    if (result === null || result === undefined) {
      return c.USER_FIND_AND_UPDATE_ERR;
    }
    return c.SUCCESS;
  } catch (err) {
    console.log(err);
    return c.GENERAL_TRY_CATCH_ERR;
  }
};

exports.updatePermissions = async function (email, permissions) {
  // return;
  try {
    const filter = { email: email };
    const update = { 'settings.permissions': permissions };
    if (!permissions.reddit) {
      update['redditData'] = {
        overview: null,
        subKarma: null,
        totalKarma: null,
      };
    }
    if (!permissions.twitter) {
      update['twitterData'] = null;
    }
    if (!permissions.twitch) {
      update['twitchData'] = null;
    }
    if (!permissions.youtube) {
      update['youtubeData'] = null;
    }
    let result = await User.findOneAndUpdate(filter, update, { new: true });
    if (result === null || result === undefined) {
      return c.USER_FIND_AND_UPDATE_ERR;
    }
    // console.log(result);
    return c.SUCCESS;
  } catch (err) {
    console.log(err);
    return c.GENERAL_TRY_CATCH_ERR;
  }
};

exports.updateRedditData = async function (email, property, data) {
  try {
    const user = await User.findOne({ email: email });
    if (!user.settings.permissions.reddit) {
      c.USER_INVALID_PERMISSIONS;
    }
    const filter = { email: email };
    const update = { [`redditData.${property}`]: data };
    let result = await User.findOneAndUpdate(filter, update);
    if (result === null || result === undefined) {
      return c.USER_FIND_AND_UPDATE_ERR;
    }
    return c.SUCCESS;
  } catch (err) {
    console.log(err);
    return c.GENERAL_TRY_CATCH_ERR;
  }
};

exports.getRedditData = async function (email) {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return c.USER_NOT_FOUND;
    }
    // console.log(user);
    if (!user.settings.permissions.reddit) {
      c.USER_INVALID_PERMISSIONS;
    }

    return user.redditData;
  } catch (err) {
    console.log(err);
    return c.GENERAL_TRY_CATCH_ERR;
  }
};

exports.getPhoneAndStatus = async function (email) {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return false;
    }

    return {phone: user.phone, status: user.phoneNotif};
  } catch (err) {
    console.log(err);
    return c.GENERAL_TRY_CATCH_ERR;
  }
};

exports.setPhone = async function (email, number) {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return false;
    }

    let result = await User.findOneAndUpdate(
      { email: email },
      { phone: number }
    );

    return true;
  } catch (err) {
    console.log(err);
    return c.GENERAL_TRY_CATCH_ERR;
  }
};

exports.toggleNotifs = async function (email, status) {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return false;
    }

    let result = await User.findOneAndUpdate(
      { email: email },
      { phoneNotif: status }
    );

    return true;
  } catch (err) {
    console.log(err);
    return c.GENERAL_TRY_CATCH_ERR;
  }
};

exports.revokeAccess = async function (email, social) {
  try {
    console.log(email)
    console.log(social)
    const user = await User.findOne({ email: email });
    var result;
    if (!user) {
      return false;
    }
    console.log("revoking access for ")
    console.log(social)
    switch (social) {
      case 'reddit':
        console.log("its reddit")
        if (!user.reddit) {
          return false;
        }
        result = await User.updateOne(
          { email: email },
          { $unset: {reddit: "", redditData: ""}}
        );
        return true;
        break
      case 'twitter':
        console.log("its twitter")
        if (!user.twitter) {
          return false;
        }
        result = await User.updateOne(
          { email: email },
          { $unset: {twitter: "", twitterData: ""}}
        );
        return true;
        break
      case 'youtube':
        console.log("its youtube")
        if (!user.youtube) {
          return false;
        }
        result = await User.updateOne(
          { email: email },
          { $unset: {youtube: "", youtubeData: ""}}
        );
        return true;
        break
      case 'twitch':
          console.log("its twitch")
          if (!user.twitch) {
            return false;
          }
          result = await User.updateOne(
            { email: email },
            { $unset: {twitch: "", twitchData: ""}}
          );
          return true;
          break
    }
    return false;

  } catch (err) {
    console.log(err);
    return c.GENERAL_TRY_CATCH_ERR;
  }
};
