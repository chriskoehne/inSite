/**
 * @fileoverview This file holds all the routes to be used by the application.
 * It may be a good idea to break this into separate files down the line if it gets too bloated
 * @author Chris Koehne <cdkoehne@gmail.com>
 */

var express = require('express');
var router = express.Router();

const demoController = require('../controllers/demoController');

const verifyController = require('../controllers/verifyController');

const userController = require('../controllers/userController');

const redditController = require('../controllers/redditController');

const twitterController = require('../controllers/twitterController');

const uploadController = require('../controllers/uploadController');

const changePasswordController = require('../controllers/changePasswordController');

const youtubeController = require('../controllers/youtubeController');

const auth = require('../auth/authentication');

router.get('/demo0', demoController.showDemo0);

router.get('/demo1', demoController.showDemo1);

router.post('/userDemo', demoController.userDemo);

router.post('/userCreation', userController.userCreation);

router.post('/verifyUser', verifyController.verify);

router.post('/login', userController.login);

router.post('/userDelete', auth.verifyToken, userController.deleteUser);

router.post(
  '/user/settings/darkMode',
  auth.verifyToken,
  userController.updateDarkMode
);

router.post(
  '/user/settings/cardOrder',
  auth.verifyToken,
  userController.updateCardOrder
);


router.post('/youtube/login', auth.verifyToken, youtubeController.login);

router.post('/youtube/codeToToken', auth.verifyToken, youtubeController.convert);

router.get('/youtube/activity', auth.verifyToken, youtubeController.activity);

router.get('/youtube/subscriptions', auth.verifyToken, youtubeController.subscriptions);

router.get('/youtube/likedVideos', auth.verifyToken, youtubeController.likedVideos);

router.post('/reddit/login', auth.verifyToken, redditController.login);

router.post('/reddit/codeToToken', auth.verifyToken, redditController.convert);

router.get('/reddit/me', auth.verifyToken, redditController.redditMe);

router.get(
  '/reddit/userOverview',
  auth.verifyToken,
  redditController.userOverview
);

router.get(
  '/reddit/userSubKarma',
  auth.verifyToken,
  redditController.userSubKarma
);

router.get(
  '/reddit/userTotalKarma',
  auth.verifyToken,
  redditController.userTotalKarma
);

router.post('/cookieCheck', auth.verifyToken, demoController.cookieCheck);

router.get(
  '/reddit/userComments',
  auth.verifyToken,
  redditController.userComments
);

router.post('/cookieCheck', auth.verifyToken, demoController.cookieCheck);

router.post('/logout', auth.removeToken);

router.post('/uploadImage', auth.verifyToken, uploadController.upload);

router.post(
  '/changePassword',
  auth.verifyToken,
  changePasswordController.checkPasswd
);

router.post('/twitter/login', auth.verifyToken, twitterController.login);

router.post('/twitter/codeToToken', auth.verifyToken, twitterController.convert);

router.get(
  '/twitter/test', 
  auth.verifyToken, 
  twitterController.test
);

module.exports = router;
