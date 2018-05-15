var models = require("./models");

module.exports = {
    create_stream : function(user) {
        models.Stream.create({})        
    },


    set_stream_online : function(user,game,title){

        return user.getStreamConfig().then(function(streamConfig){
            return streamConfig.updateAttributes({
                live: true
            }) 
        }).then(function(streamConfig){
            
    })},

    
    update_stream_config : function(user,game, title){

    },


    set_stream_offline : function(user){
        return user.getStreamConfig().then(function(streamConfig){
            return streamConfig.updateAttributes({
                live: false
            }) 
        }).then(function(streamConfig){
            
    })
    }

}