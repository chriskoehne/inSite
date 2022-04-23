const User = require('../database/models/User');
var redditService = require('../services/redditService'); // skipping over the controller because im already in the backend. Sue me
var twitterService = require('../services/twitterService'); // skipping over the controller because im already in the backend. Sue me


exports.monitor = async function (email, password) {
    console.log("monitoring")
    console.log(Date.now())
    let users = await User.find({});
    users.forEach(async (user) => {
        console.log("checking: " + user.email)
        // check for refresh need
        if (user.reddit) {
            if (user.reddit.expires_in <= Date.now()) {
                // call refresh using token
                let result = await redditService.refresh(user.reddit.refresh_token, user.email); //reddit refresh is working
    
            }
        }
        if (user.youtube) {
            if (user.youtube.expiry_date <= Date.now()) {
                //refresh the token
                console.log("youtube is expired. Does it still work on its own?")
            }
        }
        if (user.twitter) {
            if (user.twitter.expires_in <= Date.now()) {
                // refresh the token
                let result = await twitterService.refresh(user.email, user.twitter.refresh_token); //twitter refresh is working

            }
        }
    });
};

