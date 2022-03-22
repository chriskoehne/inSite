/**
 * @fileoverview This file holds all the routes to be used by the application.
 * It may be a good idea to break this into separate files down the line if it gets too bloated
 * @author Chris Koehne <cdkoehne@gmail.com>
 */

var express = require('express');
var router = express.Router();
const cors = require('cors');
const path = require('path');

const demoController = require(path.resolve(
  __dirname,
  '../controllers/demoController'
));

const userCreationController = require(path.resolve(
  __dirname,
  '../controllers/userCreationController'
));

const verifyController = require(path.resolve(
  __dirname,
  '../controllers/verifyController'
));

const userLoginController = require(path.resolve(
  __dirname,
  '../controllers/userLoginController'
));

const redditController = require(path.resolve(
  __dirname,
  '../controllers/redditController'
));

const youtubeController = require(path.resolve(
  __dirname,
  '../controllers/youtubeController'
));

const uploadController = require(path.resolve(
  __dirname,
  '../controllers/uploadController'
));

const changePasswordController = require(path.resolve(
  __dirname,
  '../controllers/changePasswordController'
));

const auth = require('../auth/authentication');

router.get('/demo0', demoController.showDemo0);

router.get('/demo1', demoController.showDemo1);

router.post('/userDemo', demoController.userDemo);

router.post('/userCreation', userCreationController.userCreation);

router.post('/verifyUser', verifyController.verify);

router.post("/userDelete", userCreationController.deleteUser);

router.post("/verifyUser", verifyController.verify);

router.post('/login', userLoginController.login);


router.post('/youtube/login', youtubeController.login);

router.post('/youtube/codeToToken', youtubeController.convert);


router.get('/youtube/activity', youtubeController.activity);

router.get('/youtube/subscriptions', youtubeController.subscriptions);


router.post('/reddit/login', redditController.login);

router.post('/reddit/codeToToken', redditController.convert);

router.get('/reddit/me', redditController.redditMe);

router.get('/reddit/userOverview', redditController.userOverview);

router.get('/reddit/userSubKarma', redditController.userSubKarma);

router.get('/reddit/userTotalKarma', redditController.userTotalKarma)

router.post('/cookieCheck', auth.verifyToken, demoController.cookieCheck);

router.get("/reddit/userComments", redditController.userComments)

router.post("/cookieCheck", auth.verifyToken, demoController.cookieCheck);

router.post('/logout', auth.removeToken);

router.post('/uploadImage', uploadController.upload);

router.post('/changePassword', changePasswordController.checkPasswd);

module.exports = router;
