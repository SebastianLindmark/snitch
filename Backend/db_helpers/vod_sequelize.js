models = require('./models')


module.exports = {


    save_vod : function(stream_key, filename){
        var userPromise = models.StreamKey.findOne({where : {key : stream_key}})
        .then(function(streamKey){
            if(streamKey !== null) return streamKey.getUser()
            else throw["Stream key does not have a user"]
        })

        return userPromise.then(function(user){
            return user.getStreamConfig()
        }).then(function(streamConfig){
            return models.VOD.create({title : streamConfig.title, path : stream_key + '/' +filename})
        }).then(function(VOD){
            var user = userPromise.value()
            return user.addVOD(VOD)
        }).catch(function(err){
            console.log(err)
        })

        

    }


}