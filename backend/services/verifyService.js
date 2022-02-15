const path = require("path");
const bcrypt = require("bcrypt");
const config = require(path.resolve(__dirname, "../config.json"));

const authToken = config.TwilioAuthToken;
var authy = require("authy")(authToken);

const User = require(path.resolve(__dirname, "../database/models/user"));
exports.check = async function (req, res) {
  try {
    // console.log(req.body);
    const email = req.body.email;
    const code = req.body.code;

    let result = await User.find({ email: email });

    
    return new Promise(resolve => {
      // api.on(event, response => resolve(response));
      authy.verify(result[0].authyId, (token=code), (force=false), function (err, authyres) {
        if (!authyres || err) {
          console.log("error caught")
          // res.status(400).send({ message: "invalid code" });
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

