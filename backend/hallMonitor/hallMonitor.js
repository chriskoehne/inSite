const User = require('../database/models/User');
var redditService = require('../services/redditService'); // skipping over the controller because im already in the backend. Sue me


exports.monitor = async function (email, password) {
    console.log(Date.now())
    let users = await User.find({});
    users.forEach(async (user) => {
        console.log(user.email)
        // check for refresh need
        if (user.reddit) {
            if (user.reddit.expires_in <= Date.now()) {
                // call refresh using token
                let result = await redditService.refresh(user.reddit.refresh_token, user.email); 
    
            }
        }
    });
};

