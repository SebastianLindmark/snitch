/**
 * The module for handling stream database-queries
 */

var models = require("./models");



module.exports = {

    /**
     * 
     * Creates a StreamConfig model
     * 
     * @argument {The user to associate the stream model for} user
     * @argument {The title of the streamconfig} title
     * @argument {The game currently played} game
     * @argument {The country, currently not used} country
     */
    create_stream_config : function(user,title,game,country) {
        
        var streamConfigPromise =  models.StreamConfig.create({title : title, live: false, viewers : 0})
        var gamePromise = models.Game.findOne({where : {name : game}})        
        return streamConfigPromise.then(function(streamConfig){
            return gamePromise
        }).then(function(game){
            var streamConfig = streamConfigPromise.value()
            if(game !== null) return game.addStreamConfig(streamConfig)
            else throw ["This game does not exist"]
        }).then(function(country){
            var streamConfig = streamConfigPromise.value()
            return user.setStreamConfig(streamConfig)
        }).then(function(streamConfig){
            return models.StreamConfig.findAll()
        }).catch(function(err){
            console.log(err)
        })
    },


    /**
     * Sets a user's streamConfig online
     */
    set_stream_online : function(user){
        return user.getStreamConfig().then(function(streamConfig){
            
            return streamConfig.updateAttributes({
                live: true
            }) 
            
        })},

    /**
     * Updates the live stream url(Where the live stream file is stored on server). Stream url dpdate is done between streams.
     */
    update_stream_url : function(user,url){
        return user.getStreamConfig().then(function(streamConfig){
            return streamConfig.updateAttributes({
                live_url: url
            }) 
        })
    },


    add_viewer_to_stream : function(user){
        return user.getStreamConfig().then(function(streamConfig){
            return streamConfig.increment('viewers')
     })},

     remove_viewer_from_stream : function(user){
        return user.getStreamConfig().then(function(streamConfig){
            return streamConfig.increment(['viewers'], {by : -1})
     })},

    set_stream_offline : function(user){
        return user.getStreamConfig().then(function(streamConfig){
            return streamConfig.updateAttributes({
                live: false
            }) 
        })
    },

    /**
     * Gets all streams that are currently online for a certain game
     */

    get_online_by_game: function(game){        
        return models.StreamConfig.findAll({where : {live:true},include : 
            [{model: models.Game, as: "Game", where : {'name' : game}}, {model:models.User, as :"User"}]})    
    }
    
}