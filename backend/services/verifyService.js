const path = require("path");
const bcrypt = require("bcrypt");
const config = require(path.resolve(__dirname, "../config.json"));

const authToken = config.TwilioAuthToken;
var authy = require("authy")(authToken);

const User = require(path.resolve(__dirname, "../database/models/user"));
exports.check = async function (req, res) {
  try {
    const email = req.body.email;
    const code = req.body.code;

    let result = await User.find({ email: email });

    return new Promise(resolve => {
      authy.verify(result[0].authyId, (token=code), (force=false), function (err, authyres) {
        if (!authyres || err) {
          console.log("error caught")
          resolve(err);
        } else {
          console.log(authyres)
          resolve(authyres);
        }
      });
    });

  } catch (err) {
    console.log("big error catch")
    return err;
  }
};

