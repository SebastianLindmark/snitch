const sqlite3 = require('sqlite3');


var db = new sqlite3.Database('./db.sqlite3');
var sqliteJson = require('sqlite-json');
//console.log(sqliteJson);
var exporter = sqliteJson('./db.sqlite3');


module.exports = {

    insert : function(query){
        var promise = new Promise(function(resolve, reject){
            db.run(query, function(err){
                if(err) return reject([401,err]);
                else return resolve(this.lastID);
            }
        );})
        return promise;   
    },
    

    get : function(query){
        var promise = new Promise(function(resolve,reject){
            db.get(query, function(err,row){
                if(err) return reject([401,err]);
                else return resolve(row);
            }); 
        });

        return promise;
    },


    drop_tables : function(){
        console.log("Dropping tables");
        db.run('DROP TABLE IF EXISTS password;');
        db.run('DROP TABLE IF EXISTS googleuser;');
        db.run('DROP TABLE IF EXISTS streamkey;');
        db.run('DROP TABLE IF EXISTS game;');
        db.run('DROP TABLE IF EXISTS country;');
        db.run('DROP TABLE IF EXISTS channel;');
        db.run('DROP TABLE IF EXISTS live;');
        db.run('DROP TABLE IF EXISTS follower;');
        db.run('DROP TABLE IF EXISTS user;',this.create_tables);
    },

    create_tables : function(){
        console.log("Creating tables");
        db.run('CREATE TABLE user(id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, username TEXT UNIQUE);');
        db.run('CREATE TABLE password(id INTEGER PRIMARY KEY, password TEXT, FOREIGN KEY(id) REFERENCES user(id));');
        db.run('CREATE TABLE googleuser(id INTEGER PRIMARY KEY, token TEXT UNIQUE, FOREIGN KEY(id) REFERENCES user(id));');
        db.run('CREATE TABLE streamkey(id INTEGER PRIMARY KEY, key TEXT UNIQUE, FOREIGN KEY(id) REFERENCES user(id));');

        db.run('CREATE TABLE game(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, url TEXT);');
        db.run('CREATE TABLE country(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE);');

        db.run('CREATE TABLE channel(id INTEGER PRIMARY KEY, game INTEGER, title TEXT, biography TEXT, country INTEGER, FOREIGN KEY(country) REFERENCES country(id),FOREIGN KEY(id) REFERENCES user(id), FOREIGN KEY(game) REFERENCES game(id));');
        db.run('CREATE TABLE live(id INTEGER PRIMARY KEY, viewers INTEGER, FOREIGN KEY(id) REFERENCES user(id));');
        db.run('CREATE TABLE follower(user INTEGER, following INTEGER, PRIMARY KEY(user, following), FOREIGN KEY(user) REFERENCES user(id),FOREIGN KEY(following) REFERENCES user(id));', insert_test_data);
    }
}

function insert_test_data(){
    console.log("Inserting test data");
    var games = ["Fortnite, League of Ledgends", "Overwatch", "PLAYERSUNKNOWN'S BATTLEGROUNDS","Dota 2", "Hearthstone","GTA V"]
    var image_urls = ["https://static-cdn.jtvnw.net/ttv-boxart/Fortnite-285x380.jpg", "https://static-cdn.jtvnw.net/ttv-boxart/League%20of%20Legends-285x380.jpg", "https://static-cdn.jtvnw.net/ttv-boxart/Overwatch-285x380.jpg", "https://static-cdn.jtvnw.net/ttv-boxart/PLAYERUNKNOWN%27S%20BATTLEGROUNDS-285x380.jpg","https://static-cdn.jtvnw.net/ttv-boxart/Dota%202-285x380.jpg","https://static-cdn.jtvnw.net/ttv-boxart/Hearthstone-285x380.jpg","https://static-cdn.jtvnw.net/ttv-boxart/Grand%20Theft%20Auto%20V-285x380.jpg"]
    var countries = ["USA","Sweden","Ireland","Italy","France","Finland","Norway"]

    for(var i = 0; i < games.length;i++){
        var query = `INSERT INTO game(name,url) VALUES ("${games[i]}","${image_urls[i]}")`;
        module.exports.insert(query).catch(reason => {
            console.log(reason);
        });
    }

    for(var i = 0; i < countries.length; i++){
        var query = `INSERT INTO country(name) VALUES ("${countries[i]}")`;
        module.exports.insert(query).catch(reason => {
            console.log(reason);
        });
    }    
}



