const express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const app = express();
var expressJwt = require("express-jwt");
var jwt = require("jsonwebtoken");
var Promise = require("promise");

app.use(express.json())
app.use(express.urlencoded());
app.use(cors());
app.use(bodyParser.json());
app.use('/protected', expressJwt({secret: "secret"}));

var models = require('./db_helpers/models')




var user_sequelize = require('./db_helpers/user_sequelize');
//models.create();


var database_helper = require("./database_helper");

var nms = require("./nms");
nms.start();

database_helper.reset_database();

var hostPort = 8000;

app.route('/').get((req, res) => {
    res.send("Welcome")
});

app.get('/protected/hello',function(req,res){
    console.log("This is nice");
    res.send("This path is only accessible by authenticated users");
});
 
app.post('/get_stream_key',expressJwt({secret: 'secret'}),function(req,res){
    var username = req.user.username;

    models.User.findOne({where : {username:username}})
    .then(function(user){
        if(user !== null) return user.getStreamKey()
        else throw ["User does not exist"]
    }).then(function(streamkey){
        if(streamkey !== null) res.send({'success' : true, 'result' : streamkey})
        else return user_sequelize.create_stream_key(username)
    }).then(function(streamkey){
        if(streamkey !== null) res.send({'success' : true, 'result' : streamkey})
        else console.log("This should not happen")
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


    user_sequelize.create_user(email,username,password).then(function(){
        res.send({'success' : true, 'result' : "Successfully created user"})
    }).catch(function(err){
        res.statusCode = 404
        res.send({'success' : false, 'reason' : err})
    })
});

app.route('/api/user/custom_login').post((req,res) => {
    var username = req.body.username;
    var pwd = req.body.password;	
    
    var userPromise = models.User.findOne({where : {username:username}})
    userPromise.then(function(user){
        if(user !== null) return user.getPassword()
        else throw ["User does not exist"]
    }).then(function(password){
        if(password === null) throw ["User is a google user"]
        else if(password.pwd === pwd) return pwd
        else throw ["Incorrect password"]
    }).then(function(password){
        var user = userPromise.value()
        token = generate_token(user.username,user.email);
        res.send({'success' : true ,'token' : token});
    }).catch(function(err){
        res.statusCode = 404
        res.send({'success' : false, 'reason' : err})
    })   

});

app.post('/api/user/google_login',function(req,res){
    var username = req.body.username;
    var googleID = req.body.googleID;

    
    var userPromise = models.User.findOne({where : {username:username}})

    userPromise.then(function(user){
        if(user !== null){
            return user.getGoogleUser()}
        else throw ["User does not exist"]
    }).then(function(googleUser){
        if(googleUser !== null){
            var user = userPromise.value()
            token = generate_token(user.username,user.email);
            console.log("Everything went fine")
            res.send({'token': token });
        } else throw ["Google user does not exist"]
    }).catch(function(err){
        console.log(err)
        res.send({'success' : false, 'reason' : err})
    })

});


app.route('/api/user/google_signup').post((req,res) => {
    var username = req.body.username;
    var email = req.body.email;
    var googleID = req.body.googleID;

    user_sequelize.create_google_user(email,username,googleID)
    .then(function(googleuser){
        res.send({result : "Successfully registered"});
    }).catch(function(err){
        console.log(err)
        res.statusCode = 404
        res.send({success : false, result : err})
    })
});


app.post('/get_logged_in_user',expressJwt({secret: 'secret'}),function(req,res){
    var username = req.user.username;
    models.User.findOne({where : {username:username}}).then(function(user){
        if(user !== null) res.send(user)
        else{
            res.statusCode = 404
            res.send("User does not exist")
        }
    })

});


app.post('/get_user',function(req,res){
    var username = req.body.username;
    console.log("Retreiving user " + username);

    models.User.findOne({where : {username:username}}).then(function(user){
        if(user !== null){
            res.send(user)
        }else{
            res.statusCode = 404
            res.send("User does not exist")
        }

    })
});


app.route('/api/test/add').get((req,res) => {
    database_helper.user.insert_user("sebbe@gmail.com","sebbe","passw");
    res.send("Done");
});

app.route('/api/test/addg').get((req,res) => {
    database_helper.user.insert_google_user("sebbe@gmail.com","sebbe", "123234543234543");
    res.send("Done");
});

app.route('/api/test/get').get((req,res) => {
    database_helper.user.get_user("sebbe",function(response){
        res.send(response);
    });
    
});

app.route('/api/test/exists').get((req,res) => {
    database_helper.user.exists_user("sebbe",function(exists){
        if(exists){
            res.statusCode = 404;
            res.send("User already exists");
            return;
        }else{
            res.send("Success");
        }
    });
    
});

models.sequelize.sync({force:true}).then(function(){
    console.log("Database successfully synced")
    app.listen(hostPort, () => {
        models.insertStaticData()
        console.log('Server started!');
    });    
})

  
  
