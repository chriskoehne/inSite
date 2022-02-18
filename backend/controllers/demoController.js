/**
 * @fileoverview A demo controller file. Controlers are used for handling higher level validation and handling response codes,
 * while services do the bulk of the work: https://www.coreycleary.me/what-is-the-difference-between-controllers-and-services-in-node-rest-apis/
 * @author Chris Koehne <cdkoehne@gmail.com>
 */

const path = require('path');

var demoService = require(path.resolve(__dirname, '../services/demoService'));

exports.showDemo0 = async function (req, res, next) {
  try {
    let result = await demoService.copyPasta();
    res.status(200).json(result);
    // res.status(200).send(result);
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.showDemo1 = async function (req, res, next) {
  try {
    let result = await demoService.amogus();
    // res.status(200).json(result);
    res.status(200).send(result);
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.userDemo = async function (req, res, next) {
  try {
    let result = await demoService.signup(req, res);
    res.status(200).json(result);
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.cookieCheck = async function (req, res, next) {
  try {
    console.log('made it')
    let result = await demoService.cookieCheck(req, res);
    res.status(200).json(result);
  } catch (e) {
    console.log(e)
    return res.status(400).json({ status: 400, message: e.message });
  }
};
