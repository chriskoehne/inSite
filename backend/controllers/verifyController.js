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
    if (!success) {
      return res.status(400).json({ status: 400, message: result.message });
    } else {
      return res.status(200).json({ status: 200, message: result.message });
    }
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

