var models = require("./models");
var Sequalize = require("sequelize");
var rand = require("random-key");

var bcrypt = require('bcrypt');
const saltRounds = 5;

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
            var user = userPromise.value()
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

    username_to_user(username){
        return models.User.findOne({where : {username:username}})
    },

    email_to_user(email){
        return models.User.findOne({where : {email:email}})
    },


    custom_signup(email,username,password){
        var create_user_function = this.create_user;
        return bcrypt.hash(password, saltRounds).then(function(hash) {
            return create_user_function(email,username,hash)
        })

    },


    custom_login(username, plainTextPassword){

        var userPromise = this.username_to_user(username)
        return userPromise.then(function(user){
            if(user !== null) return user.getPassword()
            else throw ["User does not exist"]
        }).then(function(password){
            if(password === null) throw ["User is a google user"]
            else return bcrypt.compare(plainTextPassword, password.pwd)
        }).then(function(result){
            if(!result) throw["Incorrect password"]
            else return userPromise.value()
        })
    },

    get_user_profile(username){
        var streamConfigPromise = this.username_to_user(username)
        .then(function(user){
            if(user !== null) return user.getStreamConfig()
            else throw ["User does not exist"]
        });
        
        return streamConfigPromise.then(function(streamConfig){
            return streamConfig.getGame()
        }).then(function(game){
            var userStreamConfig = streamConfigPromise.value()
            var data = {'game' :'', 'title' : ''}
            if(game !== null){
                data['game'] = game.name;     
            }
            if(userStreamConfig !== null){
                data['title'] = userStreamConfig.title;     
            }
            return data  
        })
    
    },


    update_user_profile(username,gameName,streamTitle){

        var streamConfigPromise = this.username_to_user(username).then(function(user){
            if(user === null) throw ["User does not exist"]
            else return user.getStreamConfig()
        })

        return streamConfigPromise.then(function(streamConfig){
            return models.Game.find({where : {name : gameName}})
        }).then(function(game){
            if(game === null) throw ["Game does not exist"]
            else{
                var streamConfig = streamConfigPromise.value()
                return game.addStreamConfig(streamConfig)
            }
        }).then(function(val){
            var streamConfig = streamConfigPromise.value()
            return streamConfig.updateAttributes({
                title: streamTitle
            }) 
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