/**
 * The module for handling follower database-queries.
 */


var models = require("./models");
var user_sequelize = require("./user_sequelize");

module.exports = {


    /**
     * @argument {The user fan_username should follow} idol_username 
     * @argument {The user to follow idol_username} fan_username 
     * @returns {The fan_username User instance}               
     */

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


    /**
     * @argument idol_username 
     * @argument fan_username 
     * @returns {If fan_username follows idol_username} Boolean               
     */

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

    /**
     * @argument {The user fan_username should defollow} idol_username 
     * @argument {The user to defollow idol_username} fan_username 
     * @returns  {The fan_username User instance} User               
     */

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


    /**
     * 
     * @param {the user to load followers for} username 
     * @returns {the followers of username} User[]
     */
    get_followers(username){
        var userPromise = models.User.findOne({where : {username:username}})
        return userPromise.then(function(user){
            return user.getFollowers()
        })
    },

    /**
     * 
     * @param {returns the followings of} username 
     * @returns {the users username follows} User[]
     */
    get_followings(username){
        var userPromise = models.User.findOne({where : {username:username}})
        return userPromise.then(function(user){
            return user.getFollowings()
        })
    },


    /**
     * Loads Online/Offline streams of the users username follows. 
     * @param {the username to load data for} username 
     * @returns {Returns all the users username follows along with information about their latest stream and game} any[]
     */

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