const User = require('../database/models/User');
var redditService = require('../services/redditService'); // skipping over the controller because im already in the backend. Sue me
var twitterService = require('../services/twitterService'); // skipping over the controller because im already in the backend. Sue me
var twitchService = require('../services/twitchService');
var youtubeService = require('../services/youtubeService');
var userService = require('../services/userService');

// for notifications, check if they are allowed in the user object, then send either email or text
// for text, you need to be on the approved recipient list

exports.monitor = async function (email, password) {
  console.log('Monitoring...');
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
        console.log('.'); //refreshes on its own
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
  console.log('Updating...');
  users.forEach(async (user) => {
    if (user.reddit) {
      if (user.settings.permissions.reddit) {
        const token = user.reddit.access_token;
        const username = await redditService.redditUsername(token);
        redditService.userOverview(user.email, token, username);
        redditService.userSubKarma(user.email, token, username);
        redditService.userTotalKarma(user.email, token, username);
      }
    }
    if (user.youtube) {
      if (user.settings.permissions.youtube) {
        youtubeService.checkSubsNotif(user.email, user.youtube);
        youtubeService.checkLikedVidsNotif(user.email, user.youtube);
        // implement liked videos as well
      }
    }
    // after checking all socials
    if (user.emailNotif) {
      // console.log("can send email")
      user.notificationsHouse.notifications.forEach(async (emailnotif) => {
        if (!emailnotif.sentEmail) {
          console.log('sending notif via email');
          userService.sendemail(user.email, emailnotif.content);
          //update that notif to now be sent
          const filter = {
            email: user.email,
            'notificationsHouse.notifications._id': emailnotif._id,
          };
          let update = { 'notificationsHouse.notifications.$.sentEmail': true };
          let result = await User.findOneAndUpdate(filter, update);
        }
      });
    }
    if (user.phoneNotif) {
      // console.log("can send text")
      user.notificationsHouse.notifications.forEach(async (smsnotif) => {
        if (!smsnotif.sentSMS) {
          console.log('sending notif via text');
          userService.sendsms(user.email, smsnotif.content);
          //update that notif to now be sent
          const filter = {
            email: user.email,
            'notificationsHouse.notifications._id': smsnotif._id,
          };
          let update = { 'notificationsHouse.notifications.$.sentSMS': true };
          let result = await User.findOneAndUpdate(filter, update);
        }
      });
    }
  });

  console.log('Update finished...');
};

exports.socialsDataTwitter = async () => {
  let users = await User.find({});
  console.log('Updating Twitter...');
  users.forEach(async (user) => {
    if (user.email !== 'cdkoehne@gmail.com') {
      // return;
    }
    if (user.twitter) {
      if (user.settings.permissions.twitter) {
        const token = user.twitter.access_token;
        const userId = (await twitterService.me(token)).data.id;
        twitterService.followers(token, userId, user.email);
        twitterService.following(token, userId, user.email);
      }
    }
  });
};
