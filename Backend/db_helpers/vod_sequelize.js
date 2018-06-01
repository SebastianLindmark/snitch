/**
 * The model for handling VODs (Video-on-demand) database-queries.
 */


models = require('./models')
user_sequelize = require('./user_sequelize')

module.exports = {

    /**
     * Stores a VOD
     * @argument {The streamkey to identify the user} stream_key
     * @argument {The filename of the m3u8-file used to locate the chunked stream} filename
     * @argument {The path to locate the filename on the server} rootPath
     */
    save_vod : function(stream_key, filename, rootPath){
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
            return models.VOD.create({title : streamConfig.title, path : filename, game : streamConfig.game, root_path : rootPath})
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


    /**
    * @argument {the username to load VODS for} username
    * @returns {the vods associated with the user} VOD[]
    */

    get_vods_from_user : function(username){
        return user_sequelize.username_to_user(username).then(function(user){
            let id = user.id;
            return models.sequelize.query('SELECT VODS.id,VODS.path,VODS.root_path,VODS.createdAt, VODS.title, Games.url, Games.name FROM Users, VODS, Games WHERE Users.id = VODS.userId AND VODS.game = Games.id AND Users.id = ' + id , { type: models.sequelize.QueryTypes.SELECT}).then(projects => {
                return projects
              })
            
            //return user.getVODS()
        }) 
    },


    get_vod_by_id : function(id){
        return models.VOD.findOne({where : {id : id}})
    },

    /**
     * Gets all VODS from a Game
     * @argument {The game id} id
     */
    get_vods_by_game : function(id){
        return models.sequelize.query('SELECT Users.username,VODS.id,VODS.root_path,VODS.path,VODS.createdAt, VODS.title, Games.url, Games.name FROM Users, VODS, Games WHERE Users.id = VODS.userId AND VODS.game = Games.id AND Games.id = ' + id , { type: models.sequelize.QueryTypes.SELECT}).then(projects => {
            return projects
        })
    }


}