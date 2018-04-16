const express = require('express');
const app = express();

var hostPort = 8000;

var mongoClient = require('mongodb').MongoClient;
var mongoUrl = "mongodb://localhost:27017/database";



app.route('/').get((req, res) => {
    res.send("Welcome")
});

app.route('/hello').get((req, res) => {
    res.send("Snopp :)")
});

mongoClient.connect(mongoUrl,function(err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.close();
});


app.listen(hostPort, () => {
    console.log('Server started!');
  });