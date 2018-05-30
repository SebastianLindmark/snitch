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


    remove_follower(idol_username,fan_username){
        var idolPromise = user_sequelize.username_to_user(idol_username);
        var fanPromise = user_sequelize.username_to_user(fan_username);

        return idolPromise.then(function(idol){
            return fanPromise;
        }).then(function(fan){
            var idol = idolPromise.value()
            return idol.removeFollower(fan)
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
    },

    get_follower_streams(username){

        return user_sequelize.username_to_user(username).then(function(result){
            if(result !== null){
            var id = result.id;
            
            return models.sequelize.query('SELECT Users.username,StreamConfigs.title, StreamConfigs.live_url, StreamConfigs.live, StreamConfigs.viewers, Games.name, Games.url, Games.wide_image_url FROM Users, FollowTable, StreamConfigs, Games WHERE Users.id = StreamConfigs.userId AND Users.id = FollowTable.followerId AND StreamConfigs.game = Games.id AND FollowTable.followingId = ' + id + ' ORDER BY StreamConfigs.live DESC', { type: models.sequelize.QueryTypes.SELECT}).then(projects => {
                return projects
            })
            }else{
                throw ["Username does not exist"]
            }
        })

        

    }




    
    
}