var models = require("./models");
var user_sequelize = require("./user_sequelize");

module.exports = {
    add_follower(idol_username,fan_username){
            var idolPromise = user_sequelize.username_to_user(idol_username);
            var fanPromise = user_sequelize.username_to_user(fan_username);

            return idolPromise.then(function(idol){
                return fanPromise;
            }).then(function(fan){
                var idol = idolPromise.value()
                return idol.addFollower(fan)
            })
    },

    is_following(idol_username,fan_username){
        var idolPromise = user_sequelize.username_to_user(idol_username);
        var fanPromise = user_sequelize.username_to_user(fan_username);
        return idolPromise.then(function(idol){
            return fanPromise;
        }).then(function(fan){
            var idol = idolPromise.value()
            return idol.hasFollower(fan)
        })
    },

    get_followers(username){
        var userPromise = models.User.findOne({where : {username:username}})
        return userPromise.then(function(user){
            return user.getFollowers()
        })
    },

    get_followings(username){
        var userPromise = models.User.findOne({where : {username:username}})
        return userPromise.then(function(user){
            return user.getFollowings()
        })
    }




    
    
}