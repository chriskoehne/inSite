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

const twitchController = require('../controllers/twitchController');

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
  '/user/settings/toolTips',
  auth.verifyToken,
  userController.updateToolTips
);

router.post(
  '/user/settings/cardOrder',
  auth.verifyToken,
  userController.updateCardOrder
);

router.post(
  '/user/settings/permissions',
  auth.verifyToken,
  userController.updatePermissions
);


router.post(
  '/user/reddit/',
  auth.verifyToken,
  userController.updateRedditData
);

router.get(
  '/user/reddit/',
  auth.verifyToken,
  userController.getRedditData
);

router.post('/youtube/login', auth.verifyToken, youtubeController.login);

router.post(
  '/youtube/codeToToken',
  auth.verifyToken,
  youtubeController.convert
);

router.get('/youtube/activity', auth.verifyToken, youtubeController.activity);

router.get(
  '/youtube/subscriptions',
  auth.verifyToken,
  youtubeController.subscriptions
);

router.get('/youtube/mostSubscribers', auth.verifyToken, youtubeController.mostSubscribers);

router.get('/youtube/likedVideos', auth.verifyToken, youtubeController.likedVideos);

router.get('/youtube/playlists', auth.verifyToken, youtubeController.playlists);

router.get('/youtube/popularVidsFromLiked', auth.verifyToken, youtubeController.popularVidsFromLiked);

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

router.post(
  '/twitter/codeToToken',
  auth.verifyToken,
  twitterController.convert
);

// router.get('/twitter/test', auth.verifyToken, twitterController.test);

router.get(
  '/twitter/tweetCount', 
  auth.verifyToken, 
  twitterController.tweetCount
);

router.get(
  '/twitter/getUser', 
  auth.verifyToken, 
  twitterController.me
);

router.get(
  '/twitter/tweets', 
  auth.verifyToken, 
  twitterController.tweets
);

router.get(
  '/twitter/followers', 
  auth.verifyToken, 
  twitterController.followers
);

router.get(
  '/twitter/following', 
  auth.verifyToken, 
  twitterController.following
);

router.get(
  '/twitter/likes', 
  auth.verifyToken, 
  twitterController.likes
);

router.get(
  '/twitter/tweetLikes', 
  auth.verifyToken, 
  twitterController.tweetLikes
);
router.get(
  '/twitter/followMetrics', 
  auth.verifyToken, 
  twitterController.followMetrics
);

router.get(
  '/twitch/login', 
  auth.verifyToken, 
  twitchController.login
);

router.get(
  '/twitch/convert', 
  auth.verifyToken, 
  twitchController.convert
);

/* Don't delete this, I use it to help update the schemas */
router.post('/updateSchema', demoController.updateSchema);

module.exports = router;
