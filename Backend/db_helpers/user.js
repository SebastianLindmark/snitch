var db_conn = require("./db_conn");



module.exports = {

    insert_user : function(email,username,password){
        var query = `INSERT INTO user(email,username) VALUES ("${email}","${username}")`;
        db_conn.insert(query, function(response){
            var query2 = `INSERT INTO password(id,password) VALUES ("${response}", "${password}")`;
            db_conn.insert(query2);
            console.log("custom user inserted");
        });
    },

    insert_google_user : function(email, username, google_id){
        var query = `INSERT INTO user(email,username) VALUES ("${email}","${username}")`;
        db_conn.insert(query, function(response){
            var query2 = `INSERT INTO googleuser(id,token) VALUES("${response}", "${google_id}")`;
            db_conn.insert(query2);
            console.log("Google user inserted");
        });
    },

    get_user_password : function(id,callback){
        var query = `SELECT * FROM password WHERE id = "${id}"`;
        db_conn.get(query,callback);
    },

    get_user : function(username,callback){
        var query = `SELECT * FROM user WHERE username = "${username}"`;
        db_conn.get(query,callback);
    },

    exists_google_user : function(username, googleID, callback){
        var query = `SELECT * FROM googleuser WHERE token= "${googleID}"`;
        db_conn.get(query,function(response){
            callback(response);
        });
    },

    exists_user : function(username,callback){
        var query = `SELECT * FROM user WHERE username = "${username}"`;
        db_conn.get(query,function(response){
            callback(response);
        })
    }

}