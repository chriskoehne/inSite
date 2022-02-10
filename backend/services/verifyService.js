const path = require("path");
const bcrypt = require("bcrypt");
const config = require(path.resolve(__dirname, "../config.json"));

const authToken = config.TwilioAuthToken;

const User = require(path.resolve(__dirname, "../database/models/user"));
exports.check = async function (req, res) {
  try {
    console.log(req.body);
    const email = req.body.email;
    const code = req.body.code;

    let result = await User.find({ email: email });
    var authy = require("authy")(authToken);
    console.log(email);
    console.log(code);
    console.log(result[0]);
    console.log("verifying code");
    await authy.verify(
      result[0].authyId,
      (token = code),
      function (err, authyres) {
        // if (err) {
        //   console.log("error caught")
        //   res.status(400).send({ message: "invalid code" });
        //   return;
        // }
        // console.log(authyres);
        if (!authyres) {
          callback("verify failed for some reason?");
          res.status(400).send({ message: "invalid code" });
          return;
        } else {
          console.log(authyres)
          if (authyres.success) {
            console.log("correct code");
          }
          return;
        }
      }
    );
    return;
  } catch (err) {
    return err;
  }
};
