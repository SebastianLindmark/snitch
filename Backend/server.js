const express = require('express');
const sqlite3 = require('sqlite3');

//var db = new sqlite3.Database('./db.sqlite3');
var bodyParser = require('body-parser')

var database_helper = require("./database_helper");
database_helper.reset_database();

var sqliteJson = require("sqlite-json")
exporter = sqliteJson('./db.sqlite3');

const app = express();

var hostPort = 8000;


/*function create_database(){
//db.run('DROP TABLE IF EXISTS user;')
//db.run('CREATE TABLE user(id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, username TEXT, password TEXT);');	
}*/


exporter.json('select * FROM user', function (err, json) {
  //console.log(json);
  //console.log(err);
});


app.route('/').get((req, res) => {
    res.send("Welcome")
});

app.route('/api/user/create').get((req, res) => {

    var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;	
    database_helper.user.insert_user(email,username,password);	
    res.send("")
    
});


app.route('/api/user/get').get((req, res) => {
        var username = req.body.username;
        database_helper.user.get_user(username, function(response) {
            res.send(response);
    });	
});


app.route('/api/test/sign_up').get((req,res) => {
    database_helper.user.insert_user("sebbe@gmail.com","sebbe","passw");	
});

/*app.route('/api/test/show').get((req,res) => {
    console.log("In API/TEST/SHOW");
    //console.log(database_helper.user.get_user("sebbe"));
    res.send("JApp :)");
});*/


app.route('/api/sign_up').get((req, res) => {
    var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;	
    database_helper.user.insert_user("sebbe@gmail.com","sebbe","passw");	
});


app.listen(hostPort, () => {
    console.log('Server started!');
  });
  
  
