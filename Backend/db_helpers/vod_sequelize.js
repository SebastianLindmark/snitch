models = require('./models')
user_sequelize = require('./user_sequelize')

module.exports = {


    save_vod : function(stream_key, filename){
        var userPromise = models.StreamKey.findOne({where : {key : stream_key}})
        .then(function(streamKey){
            if(streamKey !== null) return streamKey.getUser()
            else throw["Stream key does not have a user"]
        })

        var streamConfigPromise = userPromise.then(function(user){
            return user.getStreamConfig()
        })
        
        var gamePromise = streamConfigPromise.then(function(streamConfig){
            return streamConfig.getGame()
        })

        return gamePromise.then(function(result){
            let streamConfig = streamConfigPromise.value()
            return models.VOD.create({title : streamConfig.title, path : filename, game : streamConfig.game})
        }).then(function(VOD){
            var streamConfig = streamConfigPromise.value()
            var user = userPromise.value()
            return user.addVOD(VOD).then(function(user){
                return VOD
            })
        }).then(function(VOD){
            let game = gamePromise.value()
            VOD.setGame(game)
        }).catch(function(err){
            console.log(err)
        })

    },

    get_vods_from_user : function(username){
        return user_sequelize.username_to_user(username).then(function(user){
            let id = user.id;
            return models.sequelize.query('SELECT VODS.id,VODS.path,VODS.createdAt, VODS.title, Games.url, Games.name FROM Users, VODS, Games WHERE Users.id = VODS.userId AND VODS.game = Games.id AND Users.id = ' + id , { type: models.sequelize.QueryTypes.SELECT}).then(projects => {
                return projects
              })
            
            //return user.getVODS()
        }) 
    },

    get_vod_by_id : function(id){
        return models.VOD.findOne({where : {id : id}})
    }



}