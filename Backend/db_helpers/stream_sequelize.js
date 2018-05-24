var models = require("./models");

module.exports = {
    create_stream_config : function(user,title,game,country) {
        
        var streamConfigPromise =  models.StreamConfig.create({title : title, live: true, viewers : 0})
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
        //TODO add country
    },


    set_stream_online : function(user){
        return user.getStreamConfig().then(function(streamConfig){
            return streamConfig.updateAttributes({
                live: true
            }) 
        })},


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
        }).then(function(streamConfig){
            
    })
    },

    get_online_by_game: function(game){        
        return models.StreamConfig.findAll({where : {live:true},include : 
            [{model: models.Game, as: "Game", where : {'name' : game}}, {model:models.User, as :"User"}]})    
    }
    
}