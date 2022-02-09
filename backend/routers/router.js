/**
 * @fileoverview This file holds all the routes to be used by the application. 
 * It may be a good idea to break this into separate files down the line if it gets too bloated
 * @author Chris Koehne <cdkoehne@gmail.com>
 */


var express = require("express");
var router = express.Router();
const cors = require("cors");
const path = require("path");

const demoController = require(path.resolve(
  __dirname,
  "../controllers/demoController"
));

const userCreationController = require(path.resolve(
  __dirname,
  "../controllers/userCreationController"
));

router.get("/demo0", demoController.showDemo0);

router.get("/demo1", demoController.showDemo1);

router.post("/userDemo", demoController.userDemo);

router.post("/userCreation", userCreationController.userCreation);


module.exports = router;