const path = require("path");

var verifyService = require(path.resolve(
  __dirname,
  "../services/verifyService"
));

exports.verify = async function (req, res, next) {
  try {
    let result = await verifyService.check(req, res); //add await?
    console.log("controller");
    console.log(result);
    // console.log("still in controller")
    // console.log(res)
    if (!result.success) {
      console.log("sending bad")
      return res.status(400).json({ status: 400, message: result.message });
    } else {
      console.log("sending good")
      return res.status(200).json({ status: 200, message: result.message });
    }
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

