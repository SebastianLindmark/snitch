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


app.get('/generate_token', function(req, res) {
    var profile = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@doe.com',
        id: 123
    };

    var token = jwt.sign(profile, "secret", { expiresIn: 35 }); // 60*5 minutes
    res.send(token);

});



app.route('/api/user/custom_signup').post((req,res) => {
    var email = req.body.email;
	var username = req.body.username;
    var password = req.body.password;	

    //email = "sebbe.lindmark@gmail.com";
    //username ="sebbe";
    //password = "password";

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

    //username = "sebbe"
    //password = "passwords"
    
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
        else if(resB.password === password) res.send(resA);
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

    //var username = "sebbes";
    //var googleID = "123234543234543";
    database_helper.user.get_google_user(username,googleID)
    .then(function(exists){
        if (exists) return database_helper.user.get_user(username);
        else throw [401, "User does not exist, not a google user?"];})
    .then(database_helper.user.get_user(username)
    .then(function(user){ res.send(user);}))
    .catch(reason => {
        console.log(reason);
        res.statusCode = reason[0];
        res.send(reason[1]);
    })
});


app.route('/api/user/google_signup').post((req,res) => {
    var username = req.body.username;
    var email = req.body.email;
    var googleID = req.body.googleID; 
    //username = "sebbe"
    //email = "sebbe.lindmark@gmail.com"
    //googleID = "123234543234543"
    
    database_helper.user.get_user(username,googleID)
    .then(function(exists){ 
        console.log(exists);  
        if (!exists){
            return database_helper.user.insert_google_user(email,username,googleID);
        }
        else{
            throw [401, "User already exists"];
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


app.route('/get_user').get((req, res) => {
    var username = req.body.username;
    
    //username ="sebbe";

    database_helper.user.exists_user(username).then(function(user){
        if(user) res.send(user);
        else throw [401,"User does not exist"];
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
  
  
