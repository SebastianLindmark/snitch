const express = require('express');
var bodyParser = require('body-parser')
var cors = require('cors')
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


var database_helper = require("./database_helper");
database_helper.reset_database();

var hostPort = 8000;

app.route('/').get((req, res) => {
    res.send("Welcome")
});


app.route('/api/user/custom_signup').post((req, res) => {    
    var email = req.body.email;
	var username = req.body.username;
    var password = req.body.password;	
    
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
            database_helper.user.exists_google_user(username,googleID, function(exists){
                if(exists){
                    res.send(user);
                }else{
                    res.statusCode = 404;
                    res.send("The user is not a google user");
                }
            })
        }else{
            res.statusCode = 404;
            res.send("User does not exist");
        }
    }
    database_helper.user.get_user(username,getUser);
});



app.route('/api/user/google_signup').post((req, res) => {    
    var username = req.body.username;
    var email = req.body.email;
    var googleID = req.body.googleID;
    console.log("Signing up user");
    function existsUser(exists){
    
        if(!exists){
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
  
  
