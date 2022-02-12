const path = require("path");
const bcrypt = require("bcrypt");
const config = require(path.resolve(__dirname, "../config.json"));

const authToken = config.TwilioAuthToken;

const User = require(path.resolve(__dirname, "../database/models/user"));
exports.signup = async function (req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;

    if ((await User.find({ email: email })).length > 0) {
      res.status(400).send({ message: "email already in use" });
      return;
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    let result = await User.create({
      email: email,
      password: hashedPassword,
    });

    if (result instanceof User) {
      console.log("user registered successfully")
      // res.send({ message: "User registered successfully!" });
      
      var authy = require('authy')(authToken);

      authy.register_user(email, phone, async function (err, res) {
        console.log("made twilio user");
        let result = await User.findOneAndUpdate(
          {"email": email}, 
          {"authyId": res.user.id},
          );
        authy.request_sms(res.user.id, function (err, res) {
          console.log("sent user code")
          console.log(res.message);
        });
      });
      
    } else {
      console.log("failed to create user")
      res.send({ message: "Failure creating user" });
    }
    return;
  } catch (err) {
    return err;
  }
};
