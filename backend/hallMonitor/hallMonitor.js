const User = require('../database/models/User');
var redditService = require('../services/redditService'); // skipping over the controller because im already in the backend. Sue me
var twitterService = require('../services/twitterService'); // skipping over the controller because im already in the backend. Sue me
var twitchService = require('../services/twitchService');
var userService = require('../services/userService');

// for notifications, check if they are allowed in the user object, then send either email or text
// for text, you need to be on the approved recipient list

exports.monitor = async function (email, password) {
  console.log('monitoring');
  // console.log(Date.now())
  let users = await User.find({});
  users.forEach(async (user) => {
    // console.log("checking: " + user.email)
    // check for refresh need
    if (user.reddit) {
      if (user.reddit.expires_in <= Date.now()) {
        // call refresh using token
        await redditService.refresh(user.reddit.refresh_token, user.email); //reddit refresh is working
      }
    }
    if (user.youtube) {
      if (user.youtube.expiry_date <= Date.now()) {
        //refresh the token
        console.log('youtube is expired. Does it still work on its own?'); //answer is yes.
      }
    }
    if (user.twitter) {
      if (user.twitter.expires_in <= Date.now()) {
        // refresh the token
        await twitterService.refresh(user.email, user.twitter.refresh_token); //twitter refresh is working
      }
    }
    if (user.twitch) {
      if (user.twitch.expires_in <= Date.now()) {
        // console.log('refreshing twitch');
        // console.log(user.email);
        await twitchService.refresh(user.email, user.twitch.refresh_token); //twitch refresh working
      }
    }
  });
};

exports.socialsData = async () => {
  let users = await User.find({});
  users.forEach(async (user) => {
    if (user.reddit && user.email === 'cdkoehne@gmail.com') {
      if (user.settings.permissions.reddit) {
        const token = user.reddit.access_token;
        const username = await redditService.redditUsername(token);
        redditService.userOverview(user.email, token, username);
        redditService.userSubKarma(user.email, token, username);
        redditService.userTotalKarma(user.email, token, username);
      }
    }
  });
};
