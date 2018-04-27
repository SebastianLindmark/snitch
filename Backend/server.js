const express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const app = express();
var expressJwt = require("express-jwt");
var jwt = require("jsonwebtoken");


app.use(express.json())
app.use(express.urlencoded());
app.use(cors());
//app.use(bodyParser.urlencoded({
//    extended: true}));
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


app.route('/api/user/custom_signup').post((req, res) => {    
    var email = req.body.email;
	var username = req.body.username;
    var password = req.body.password;	
    console.log("Custom user signup");
    function existsUser(exists){
        
        if(!exists){
            database_helper.user.insert_user(email,username,password);	
            res.send("");
        }else{
            res.statusCode = 404;
            res.send("User already exists");
        }
    }
    database_helper.user.exists_user(username,existsUser);
});

app.route('/api/user/custom_login').post((req, res) => {    
	var username = req.body.username;
    var password = req.body.password;	
    console.log("Custom user login");
    function existsUser(user){
        if(user){
            database_helper.user.get_user_password(user.id, function(response) {
                if(response.password === password){
                    res.send(user);
                }else{
                    res.send("Invalid password");
                }
            });
        }else{
            res.statusCode = 404;
            res.send("User does not exist");
        }
    }
    database_helper.user.exists_user(username,existsUser);
});


app.route('/api/user/google_login').post((req, res) => {    
    var username = req.body.username;
    var googleID = req.body.googleID;

    function getUser(user){
        if(user !== undefined){
            console.log("Checking if google user exists in the database")
            database_helper.user.exists_google_user(username,googleID, function(exists){
                if(exists){
                    console.log("User exists, logging in.")
                    res.send(user);
                }else{
                    console.log("User does not exist, login failed.")
                    res.statusCode = 404;
                    res.send("The user is not a google user");
                }
            })
        }else{
            console.log("The user does not exist in the database")
            res.statusCode = 404;
            res.send("User does not exist");
        }
    }

    console.log("The username in " + username);
    database_helper.user.get_user(username,getUser);
});



app.route('/api/user/google_signup').post((req, res) => {    
    var username = req.body.username;
    var email = req.body.email;
    var googleID = req.body.googleID;
    console.log("Signing up user");
    function existsUser(exists){
    
        if(!exists){
            console.log("Signing up google user");
            database_helper.user.insert_google_user(email,username,googleID);	
            res.send("");
        }else{
            res.send("User is already registered. This is ok for this route.");
        }
    }
    database_helper.user.exists_user(username,existsUser);
});

app.route('/api/user/get').post((req, res) => {
        var username = req.body.username;
        var exists_user = database_helper.user.exists_user(username);

        if(!exists_user){
            res.statusCode = 404;
            res.send("User does not exist");
            return;
        }
        
        database_helper.user.get_user(username, function(response) {
            res.send(response);
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
  
  
