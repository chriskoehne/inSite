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

    return new Promise((resolve, reject) => {
      authy.verify(
        result[0].authyId,
        (token = code),
        (force = false),
        function (err, authyres) {
          if (!authyres || err) {
            console.log("error caught");
            reject(res.status(400).send({ message: "invalid code" }));
            return;
            // throw Error('Invalid code')
            
          } else {
            console.log(authyres);
            resolve(authyres)
            return;
          }
        }
      );
    });

    // await authy.verify(result[0].authyId, (token=code), (force=false), function (err, authyres) {
    //       if (!authyres || err) {
    //         console.log("error caught")
    //         res.status(400).send({ message: "invalid code" });
    //         return;
    //       } else {
    //         console.log(authyres)
    //         return;
    //       }
    //     });

    // await makeCall(result[0].authyId, code, process, res).then(function(ans) {
    //   console.log("gtg")
    //   return;
    // });
  } catch (err) {
    return err;
  }
};

// async function makeCall(id, code, callback, res){
//   // console.log(id)7
//   await authy.verify(id, (token=code), (force=false), function (err, authyres) {
//     if (!authyres || err) {
//       console.log("error caught")
//       callback(id, code, err, res);
//     } else {
//       console.log(authyres)
//       callback(id, code, authyres, res);
//     }
//   });
// }

// function process(id, code, finalresponse, res){
//   console.log(finalresponse);
//   if (!finalresponse.success) {
//     console.log("invalid code caught")
//     res.status(400).send({ message: "invalid code" });
//   }
//   console.log("returning")
//   return;
// }
