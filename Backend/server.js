const express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const app = express();
var expressJwt = require("express-jwt");
var jwt = require("jsonwebtoken");
var Promise = require("promise");
var rand = require("random-key");

app.use(express.json())
app.use(express.urlencoded());
app.use(cors());
app.use(bodyParser.json());
app.use('/protected', expressJwt({secret: "secret"}));

const NodeMediaServer = require('node-media-server');

const config = {
    rtmp: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 60,
      ping_timeout: 30
    },
    http: {
      port: 8080,
      mediaroot: './media',
      allow_origin: '*'
    }
  };
   
  var nms = new NodeMediaServer(config)
  nms.run();

var database_helper = require("./database_helper");
database_helper.reset_database();

var hostPort = 8000;

app.route('/').get((req, res) => {
    res.send("Welcome")
});

app.get('/protected/hello',function(req,res){
    console.log("This is nice");
    res.send("This path is only accessible by authenticated users");
});
 
// TODO: Make more beautiful!
app.post('/get_stream_key',expressJwt({secret: 'secret'}),function(req,res){
    var username = req.user.username;
    database_helper.user.get_streamkey(username).then(function(exists){
        if(!exists){
            var new_key = generate_streamkey();
            database_helper.user.insert_streamkey(username, new_key);
            return {key: new_key};
        } else {
            return exists;
        }
    }).then(function(result){
        res.send(result);
    }).catch(reason => {
        res.statusCode = reason[0];
        res.send(reason[1]);
    });

});

function generate_streamkey(){
    var stream_key = "snitch_live_"
    stream_key += rand.generate(50);
    return stream_key;
}


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
<<<<<<< HEAD
    var password = req.body.password;	
=======
    var password = req.body.password;
>>>>>>> a72d9c5bceb07f7364b907f993ba4716089294ec

    database_helper.user.exists_user(username).then(function(exists){
        if(!exists) return database_helper.user.insert_user(email,username,password);
        else throw [401,"Unable to signup, user already exists"];
    }).then(function(result){
        res.send({result : "Successfully registered"});
    }).catch(reason => {
        console.log(reason);
        res.statusCode = reason[0];
        res.send(reason[1]);
    });

});

app.route('/api/user/custom_login').post((req,res) => {
    var username = req.body.username;
    var password = req.body.password;	
    
    var step1 = database_helper.user.exists_user(username)
    .then(function(exists){
        if(exists) return database_helper.user.get_user(username);
        else throw [401,"User does not exist"];
    });
    
    var step2 = step1.then(function(user){
        return database_helper.user.get_user_password(user.id)
    });


    Promise.all([step1,step2]).then(function([resA,resB]){
        if(!resB) throw [401,"User is a google user"];
        else if(resB.password === password){
            token = generate_token(resA.username,resB.email);
            res.send({'token' : token});
        } 
        else throw [401,"Password is not correct"];
    }).catch(reason =>{
        console.log(reason);
        res.statusCode = reason[0];
        res.send(reason[1]);
    });
    


});

app.post('/api/user/google_login',function(req,res){
    var username = req.body.username;
    var googleID = req.body.googleID;

    database_helper.user.get_google_user(username,googleID)
    .then(function(exists){
        if (exists) return database_helper.user.get_user(username);
        else throw [401, "User does not exist, not a google user?"];})
    .then(database_helper.user.get_user(username)
    .then(function(user){ 
        token = generate_token(user.username,user.email);
        res.send({'token': token });
    }))
    .catch(reason => {
        res.statusCode = reason[0];
        res.send(reason[1]);
    })
});


app.route('/api/user/google_signup').post((req,res) => {
    var username = req.body.username;
    var email = req.body.email;
    var googleID = req.body.googleID; 
    
    database_helper.user.get_user(username,googleID)
    .then(function(exists){ 
        console.log(exists);  
        if (!exists){
            return database_helper.user.insert_google_user(email,username,googleID);
        }
        else{
            //The user is already registered. This is ok.
            //The returned value is currently not used but could be in future. 
            return database_helper.user.get_google_user(email,googleID);
        } 
    })
    .then(function(row) {
        res.send({result : "Successfully registered"});
    }).catch(reason => {
        console.log("Caught error " + reason);
        res.statusCode = reason[0];
        res.send(reason[1]);
    })
});

app.post('/get_logged_in_user',expressJwt({secret: 'secret'}),function(req,res){
    
    var username = req.user.username;
    console.log("Username " + req.user.username);

    database_helper.user.exists_user(username).then(function(user){
        if(user) res.send(user);
        else throw [401,"User does not exist"];
    }).catch(reason => {
        console.log(reason);
        res.statusCode = reason[0];
        res.send(reason[1]);
    });

});

<<<<<<< HEAD
app.post('/get_logged_in_user',expressJwt({secret: 'secret'}),function(req,res){
    
    var username = req.user.username;
    console.log("Username " + req.user.username);

    database_helper.user.exists_user(username).then(function(user){
        if(user) res.send(user);
        else throw [401,"User does not exist"];
    }).catch(reason => {
        console.log(reason);
        res.statusCode = reason[0];
        res.send(reason[1]);
    });

});

=======
app.route('/get_user').get((req, res) => {
    var username = req.body.username;
>>>>>>> a72d9c5bceb07f7364b907f993ba4716089294ec

app.post('/get_user',function(req,res){
    var username = req.body.username;
    console.log("Retreiving user " + username);
    database_helper.user.exists_user(username).then(function(user){
        if(user) res.send(user);
        else throw [404,"User does not exist"];
    }).catch(reason => {
        console.log(reason);
        res.statusCode = reason[0];
        res.send(reason[1]);
    });

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


app.listen(hostPort, () => {
    console.log('Server started!');
});
  
  
