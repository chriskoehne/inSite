const path = require("path");
const bcrypt = require("bcrypt");
const config = require(path.resolve(__dirname, "../config.json"));

const authToken = config.TwilioAuthToken;

const User = require(path.resolve(__dirname, "../database/models/user"));
exports.check = async function (req, res) {
  try {
    console.log("in service")
    const email = req.body.email;
    const password = req.body.password;

    let result = await User.find({
      email: email,
    });
    if (result.length < 1) {
      res.status(400).send({ message: "wrong email" });
      return;
    }
    
    var authy = require('authy')(authToken);

    await bcrypt.compare(password, result[0].password).then(function(resulty) {
      console.log("comparing")
      console.log(resulty)
      if (resulty) {
        console.log("user log in successful");
        console.log(result[0].authyId)
        // console.log(type(result[0].authyId))
        console.log("sending authy code")
        authy.request_sms((result[0].authyId), function (err, authyres) {
          console.log("sent user code")
          console.log(authyres.message);
        });
      } else {
        console.log("incorrect password")
        res.status(400).send({ message: "wrong password" });
      }
    });
    // res.status(400).send({ message: "wrong password" });
    return;
    
  } catch (err) {
    return err;
  }
};
