const express = require('express');
var bodyParser = require('body-parser')
const app = express();


var database_helper = require("./database_helper");
database_helper.reset_database();


var hostPort = 8000;

app.route('/').get((req, res) => {
    res.send("Welcome")
});


app.route('/api/user/sign_up').get((req, res) => {    
    var email = req.body.email;
	var username = req.body.username;
    var password = req.body.password;	
    
    if(!database_helper.user.exists_user(username)){
        database_helper.user.insert_user(email,username,password);	
        res.send("Successfully created user")
    }else{
        res.statusCode = 404;
        res.send("User already exists");
    }
    
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
  
  
