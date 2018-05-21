var models = require("./models");
var Sequalize = require("sequelize");
var rand = require("random-key");

function generate_streamkey(){
    var stream_key = "snitch_live_"
    stream_key += rand.generate(50);
    return stream_key;
}

module.exports = {


    create_user : function(email,username,password){
        
        var userPromise = models.User.create({email : email, username: username})
        return userPromise.then(function(user){
            return models.Password.create({pwd : password})
        }).then(function(password){
            var user = userPromise.value();
            user.setPassword(password)
            return password;
        }).then(function(password){
            return models.StreamConfig.create({title : "", live: false, viewers : 0})
        }).then(function(streamConfig){
            var user = userPromise.value()[0]
            return user.setStreamConfig(streamConfig)
        }).then(function(password){
            return userPromise.value()
        })
    },

    create_google_user : function(email,username,google_id){
        var userPromise = models.User.findOrCreate({where : {email : email, username: username}})

        return userPromise.then(function(user){
            return models.GoogleUser.findOrCreate({where : {token : google_id}})
        }).then(function(googleUser){
            var user = userPromise.value()[0];
            googleUser = googleUser[0]
            return user.setGoogleUser(googleUser)
        }).then(function(password){
            return models.StreamConfig.create({title : "", live: false, viewers : 0})
        }).then(function(streamConfig){
            var user = userPromise.value()[0]
            return user.setStreamConfig(streamConfig)
        })
    },

    create_stream_key : function(username) {
        var userPromise = models.User.findOne({where : {username:username}})
        
        return userPromise
        .then(function(user){
            var key = generate_streamkey();
            return models.StreamKey.create({"key" : key})})
        .then(function(streamKey){
            var user = userPromise.value()
            return user.setStreamKey(streamKey)
        })
    },

    run_tests : function(){

        var userPromise = this.create_user("sebbe@gmail.com","uncleserb","secret");

        userPromise.then(function(res){
            var user = userPromise.value()
            return module.exports.create_stream_key(user.username,"secret-key")
        }).then(function(streamkey){
            console.log("Received streamkey " + streamkey)
        }).then(function(){
            return models.User.findById(13)
        }).then(function(user){
            if(user === null){
                console.log("not found")
            }else{
                console.log(user)
            }
            
        })       

    }


}