const sqlite3 = require('sqlite3');


var db = new sqlite3.Database('./db.sqlite3');
var sqliteJson = require('sqlite-json');
//console.log(sqliteJson);
var exporter = sqliteJson('./db.sqlite3');


module.exports = {

    insert : function(query, callback = null){
        db.run(query, (err,row) =>{
            if(callback) {
                callback(this.lastId);
            }
        });
    },

    get : function(query,callback){
        db.get(query, (err,row) =>{
            console.log("result");            
            callback(row);
        });
        
    },


    drop_tables : function(){
        console.log("Dropping tables");
        db.run('DROP TABLE IF EXISTS password;');
        db.run('DROP TABLE IF EXISTS googleuser;');
        db.run('DROP TABLE IF EXISTS user;',this.create_tables);
    },

    create_tables : function(){
        console.log("Creating tables");
        db.run('CREATE TABLE user(id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, username TEXT UNIQUE);');
        db.run('CREATE TABLE password(id INTEGER PRIMARY KEY, password TEXT, FOREIGN KEY(id) REFERENCES user(id));');
        db.run('CREATE TABLE googleuser(id INTEGER PRIMARY KEY, token TEXT UNIQUE, FOREIGN KEY(id) REFERENCES user(id));')
    }
}



