const express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const app = express();

const Sequelize = require("sequelize");
const Op = Sequelize.Op;
var expressJwt = require("express-jwt");
var jwt = require("jsonwebtoken");
var Promise = require("promise");


app.use(express.json())
app.use(express.urlencoded());
app.use(cors());
app.use(bodyParser.json());
app.use('/protected', expressJwt({secret: "secret"}));

var path = require('path');
app.use(express.static('media'))

var chatServer = require('./chat-server')

var rand = require("random-key");

var models = require('./db_helpers/models')
var user_sequelize = require('./db_helpers/user_sequelize');
var stream_sequelize = require('./db_helpers/stream_sequelize');
var database_helper = require("./database_helper");
var follower = require('./db_helpers/follower_sequelize');
var vod = require('./db_helpers/vod_sequelize')
var game = require('./db_helpers/game_sequelize')


var nms = require("./nms");
nms.start();

var chat = require("./chat-server");


database_helper.reset_database();
var hostPort = 8000;

app.route('/').get((req, res) => {
    res.send("Welcome")
});


app.post('/protected/update_username', function(req, res){
    var username = req.user.username;
    var newusername = req.body.username;
    
    var userPromise = user_sequelize.username_to_user(username)
    return userPromise
    .then(function(user){
        if(user !== null){
            return user_sequelize.username_to_user(newusername);
        } 
        else throw ['User does not exist']
    }).then(function(newuser){
        if(newuser !== null){
            res.statusCode = 200
            res.send({'success' : false})
        } else {
            var user = userPromise.value();
            user.updateAttributes({
                username: newusername
            })
            var email = user.get('email');
            token = generate_token(newusername, email);
            res.statusCode = 200    
            res.send({'success' : true, 'token' : token})
        }
    }).catch(function(err){
        console.log(err)
        res.statusCode = 404
        res.send({'success' : false, 'reason' : err})
    })
});

app.post('/get_user_stream_key', function(req, res){
    var username = req.body.username;
    models.User.findOne({where : {username:username}})
    .then(function(user){
        if(user !== null) return user.getStreamKey()
        else throw ["User does not exist"]
    }).then(function(streamkey){
        if(streamkey !== null) res.send({'success' : true, 'result' : streamkey})
        else res.send({'success' : false, 'result' : 'User has no streamkey'})
    }).catch(function(err){
        console.log(err)
        res.statusCode = 404
        res.send({'success' : false, 'reason' : err})
    })
});



app.post('/protected/get_stream_key',expressJwt({secret: 'secret'}),function(req,res){
    var username = req.user.username;

    user_sequelize.username_to_user(username)
    .then(function(user){
        if(user !== null) return user.getStreamKey()
        else throw ["User does not exist"]
    }).then(function(streamkey){
        if(streamkey !== null) res.send({'success' : true, 'result' : streamkey})
        else return user_sequelize.create_stream_key(username)
    }).then(function(streamkey){
        if(streamkey !== null) res.send({'success' : true, 'result' : streamkey})
        else throw["This should not happen"]
    }).catch(function(err){
        console.log(err)
        res.statusCode = 404
        res.send({'success' : false, 'reason' : err})
    })
});



function generate_token(username,email){
    var profile = {
        username: username,
        email: email,
    };

    var token = jwt.sign(profile, "secret", { expiresIn: 60 * 60 * 24 }); // 60*5 minutes
    return token;
}

app.route('/api/user/custom_signup').post((req,res) => {
    var email = req.body.email;
	var username = req.body.username;
    var password = req.body.password;	
    user_sequelize.custom_signup(email,username,password).then(function(user){
        res.send({'success' : true, 'result' : "Successfully created user"})
    }).catch(function(err){
        console.log(err)
        res.statusCode = 404
        res.send({'success' : false, 'result' : err})
    })
});

app.route('/api/user/custom_login').post((req,res) => {
    var username = req.body.username;
    var plaintextPwd = req.body.password;	
    user_sequelize.custom_login(username,plaintextPwd).then(function(user){
        token = generate_token(user.username,user.email);
        res.send({'success' : true ,'token' : token});
    }).catch(function(err){
        console.log(err)
        res.statusCode = 404
        res.send({'success' : false, 'reason' : err})
    })   
});

app.post('/api/user/google_login',function(req,res){
    var username = req.body.username;
    var googleID = req.body.googleID;
    var email = req.body.email;

    var userPromise = user_sequelize.email_to_user(email)

    userPromise.then(function(user){
        if(user !== null) return user.getGoogleUser()
        else throw ["User does not exist"]
    }).then(function(googleUser){
        if(googleUser !== null){
            var user = userPromise.value()
            token = generate_token(user.username, user.email);
            console.log("Everything went fine")
            res.send({success : true, 'token': token});
        } else throw ["Google user does not exist"]
    }).catch(function(err){
        console.log(err)
        res.statusCode = 404;
        res.send({'success' : false, 'result' : err})
    })

});


app.route('/api/user/google_signup').post((req,res) => {
    var username = req.body.username;
    var email = req.body.email;
    var googleID = req.body.googleID;

    user_sequelize.email_to_user(email)
    .then(function(user){
        if(user !== null){
            res.send({success : false, result : "User already exists"})
        } else {
            return user_sequelize.create_google_user(email,username,googleID)
            .then(function(googleuser){
                res.send({success: true, result : "Successfully registered"});
            }).catch(function(err){
                console.log(err)
                res.statusCode = 404
                res.send({success : false, result : err})
            })
        }
    })
  
});


app.post('/get_logged_in_user',expressJwt({secret: 'secret'}),function(req,res){
    var username = req.user.username;
    user_sequelize.username_to_user(username).then(function(user){
        if(user !== null) res.send({success:true, result:user})
        else throw ["User does not exist"]
    }).catch(function(err){
        console.log(err);
        res.statusCode = 404;
        res.send({success:false,result:err})
    })
});


app.post('/get_user',function(req,res){
    var username = req.body.username;
    user_sequelize.username_to_user(username).then(function(user){
        if(user !== null) res.send({success:true,result:user})
        else throw ["User does not exist"]
    }).catch(function(err){
        console.log(err);
        res.statusCode = 404;
        res.send({success:false,result:err})

    })
});



app.route('/get_games').post((req,res) => {
    game.get_games_with_viewer_count().then(games => {
        res.send({success : true, result : games})
    }).catch(err => {
        console.log(err)
        res.statusCode = 404
        res.send({success : false, result : err})
    })
})

app.route('/get_game').post((req,res) => {
    var game = req.body.game_name;
    models.Game.find({where : {name : game}}).then(function(game){
        res.send({success:true,result : game})
    }).catch(function(err){
        res.statusCode = 404;
        res.send({success:false,result:err})
    })
})


app.route('/get_game_by_id').post((req,res) => {
    let id = req.body.id;
    models.Game.find({where : {id : id}}).then(function(game){
        res.send({success:true,result : game})
    }).catch(function(err){
        res.statusCode = 404;
        res.send({success:false,result:err})
    })
})


app.route('/search_user').post((req,res) => {
    var username = req.body.username;
    user_sequelize.search_users(username).then(function(users){
        res.send({success:true,result : users})
    }).catch(function(err){
        console.log(err)
        res.statusCode = 404;
        res.send({success:false,result:err})
    })
})



app.route('/search_game').post((req,res) => {
    var game = req.body.game_name;
    models.Game.find({where : {name : {[Op.like] : game + '%'}}}).then(function(game){
        if(game !== null){
            res.send({success:true,result : game})
        }else{
            res.send({success:false,result : ""})
        }
        
    }).catch(function(err){
        console.log(err)
        res.statusCode = 404;
        res.send({success:false,result:err})
    })
})


app.route('/get_vods_by_game').post((req,res) => {
    let gameId = req.body.id;

    vod.get_vods_by_game(gameId).then(result => {
        res.send({success:true,result : result})
    }).catch(err => {
        console.log(err)
        res.statusCode = 404;
        res.send({success:false,result:err})
    })
})




app.post('/update_user_profile',expressJwt({secret: 'secret'}),function(req,res){
    var username = req.user.username;
    var gameName = req.body.game_name;
    var streamTitle = req.body.title;

    user_sequelize.update_user_profile(username,gameName,streamTitle).then(function(streamConfig){
        res.send({success:true,result:"Successfully update profile"})
    }).catch(function(err){
        console.log(err)
        res.statusCode = 404
        res.send({success : false, result : err})
    })
})


app.post('/get_user_profile',function(req,res){
    var username = req.body.username
    user_sequelize.get_user_profile(username).then(function(data){
        res.send({success:true,result:data})
    }).catch(function(err){
        console.log(err)
        res.statusCode = 404;
        res.send({success:false,result:err})
    })
});


app.route('/get_online_by_game').post((req,res) => {
    var game = req.body.game;
    return stream_sequelize.get_online_by_game(game)
    .then(function(onlineGames){
        res.send({success: true, result : onlineGames})
    }).catch(function(err){
        console.log(err)
        res.statusCode = 404;
        res.send({success : false});
    })    
});


app.post('/follow_user',expressJwt({secret: 'secret'}),function(req,res){
    var currentUser = req.user.username;
    var userToFollow = req.body.username;
    
    return follower.add_follower(userToFollow,currentUser).then(function(result){
        res.send({success:true,result:true})
    }).catch(function(err){
        console.log(err)
        res.statusCode = 500;
        res.send({success:false,result:err})
    });
});


app.post('/is_following',expressJwt({secret: 'secret'}),function(req,res){
    var currentUser = req.user.username;
    var userToFollow = req.body.username;
    
   follower.is_following(userToFollow,currentUser).then(function(result){
        res.send({success:true,result:result})
    }).catch(function(err){
        console.log(err)
        res.statusCode = 500;
        res.send({success:false,result:err})
    });

});

app.post('/follow_user_remove',expressJwt({secret: 'secret'}),function(req,res){
    var currentUser = req.user.username;
    var userToFollow = req.body.username;
    
   follower.remove_follower(userToFollow,currentUser).then(function(result){
        res.send({success:true,result:false})
    }).catch(function(err){
        console.log(err)
        res.statusCode = 500;
        res.send({success:false,result:err})
    });

});



app.post('/get_followers',expressJwt({secret: 'secret'}),function(req,res){
    var username = req.body.username;

    follower.get_followers(username).then(function(result){
        res.send({success:true,result:result})
    }).catch(function(err){
        console.log(err)
        res.statusCode = 500;
        res.send({success:false,result:err})
    });

});

app.post('/get_followings',expressJwt({secret: 'secret'}),function(req,res){
    var currentUser = req.user.username;
    
    follower.get_followings(currentUser).then(function(result){
        res.send({success:true,result:result})
    }).catch(function(err){
        console.log(err)
        res.statusCode = 500;
        res.send({success:false,result:err})
    });    

});


//get_live_followings
app.post('/get_follower_streams',expressJwt({secret: 'secret'}),function(req,res){
    let username = req.user.username;
    follower.get_follower_streams(username).then(function(result){
        res.send({success: true, result : result})
    }).catch(err => {
        console.log(err)
        res.statusCode = 500;
        res.send({success:false,result:err})
    })
})


app.route('/get_vods_by_user').post((req,res) => {
    let username = req.body.username;
    vod.get_vods_from_user(username).then(function(result){
        res.send({success:true,result:result})
    }).catch(function(err){
        console.log(err)
        res.statusCode = 500;
        res.send({success:false,result:err})
    })
})

app.route('/get_vod_by_id').post((req,res) => {
    let id = req.body.id;
    vod.get_vod_by_id(id).then(function(result){
        res.send({success:true,result:result})
    }).catch(function(err){
        console.log(err)
        res.statusCode = 500;
        res.send({success:false,result:err})
    })
})




app.route('/api/test/get1').get((req,res) => {
    
    var name = rand.generate(1);

    user_sequelize.create_user("sebbe@gmail.com" + name,"uncleseb" + name,"secret")
    .then(function(user){
        return stream_sequelize.create_stream_config(user,"Test title","Fortnite","Sweden")
    }).then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
        res.send(err)
    })
});

app.route('/api/test/get2').get((req,res) => {
    
    var name = rand.generate(1);

    var user1 = user_sequelize.create_user("idol@gmail.com" + name,"idol" + name,"secret")
    var user2 = user1.then(function(user){
        return user_sequelize.create_user("fan@gmail.com","fan","secret")
    })
    
    user2.then(function(result){
        return follower.add_follower(user1.value(),user2.value())
    }).then(function(something){
        return follower.is_following(user1.value(),user2.value())
    }).then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err)
        res.send(err)
    })
});


console.log("About to sync")
models.sequelize.sync({force:false}).then(function(){
    console.log("Database successfully synced")
    app.listen(hostPort, '0.0.0.0', () => {
        //models.insertStaticData()
        //name()
        console.log('Server started!');
    });    
})


function name(){
    
    var titles = ["Playing with Drake", "Rampage with MirroW", "New Session stream"]
    var emails = ["1@gmail.com", "2@gmail.com", "3@gmail.com"]
    var usernames = ["Ninja", "Kitboga", "shroud"]
    var promises = []
    var users = []
    
    var userPromise1 = user_sequelize.create_user("1@gmail.com","Ninja","password")
    var promise = userPromise1.then(function(user){
        return stream_sequelize.create_stream_config(user, "Fortnite with Drake", "Fortnite","Sweden");
    }).then(function(streamConfig){
        return stream_sequelize.set_stream_online(userPromise1.value());
    })

    var userPromise2 = user_sequelize.create_user("2@gmail.com","Kitboga","password")
    promise = userPromise2.then(function(user){
        return stream_sequelize.create_stream_config(user, "Let's Game!", "League of Legends","Sweden");
    }).then(function(streamConfig){
        //return stream_sequelize.set_stream_online(userPromise2.value());
    })

    var userPromise3 = user_sequelize.create_user("3@gmail.com","snake","password")
    promise = userPromise3.then(function(user){
        return stream_sequelize.create_stream_config(user, "3RD ROUND XAL", "League of Legends","Sweden");
    }).then(function(streamConfig){
        //return stream_sequelize.set_stream_online(userPromise2.value());
    })


    users.push(userPromise1)
    users.push(userPromise2)
    users.push(userPromise3)


    promises.push(promise)
    

    Promise.all(promises).then(function(res){
        //do nothing
        return ""
    }).then(function(something){
        return follower.add_follower(users[0].value().username,users[1].value().username)
    }).then(function(asd){
        return follower.add_follower(users[2].value().username,users[1].value().username)
    }).then(function(asd){
        return follower.add_follower(users[0].value().username,users[2].value().username)
    }).then(function(asd){
        return follower.add_follower(users[1].value().username,users[0].value().username)
    }).catch(function(err){
        console.log(err)
    })
   
}

  
  
