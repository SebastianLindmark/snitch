var models = require("./models");

module.exports = {
    create_stream_config : function(user,game,country) {
                
        var streamConfigPromise =  models.StreamConfig.create({biography : "Hello", live: false, viewers : 0})
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
        }).then(function(asd){
            return models.StreamConfig.findAll()
        })
        //TODO add country
    },


    set_stream_online : function(user){

        return user.getStreamConfig().then(function(streamConfig){
            return streamConfig.updateAttributes({
                live: true
            }) 
        })},

    
    update_stream_config : function(user){

    },


    set_stream_offline : function(user){
        return user.getStreamConfig().then(function(streamConfig){
            return streamConfig.updateAttributes({
                live: false
            }) 
        }).then(function(streamConfig){
            
    })
    },

    get_online_by_game: function(game){
        //return models.StreamConfig.findAll()
        
        return models.StreamConfig.findAll({where : {live:true},include : 
            [{model: models.Game, as: "Game", where : {'name' : game} }]})
        
         //sequelize.query('SELECT * FROM projects ', { model: Projects }).then(projects => {
            // Each record will now be a instance of Project
         // })


         //return models.Game.findAll({where : {name : game},include : [{model: models.StreamConfig, as: "StreamConfig", where : {live : true}}]})
    }   

}