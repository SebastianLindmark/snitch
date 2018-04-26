var db_conn = require("./db_conn");



module.exports = {

    insert_user : function(email,username,password){
        var query = `INSERT INTO user(email,username) VALUES ("${email}","${username}")`;
        db_conn.insert(query, function(response){
            var query2 = `INSERT INTO password("${response}", "${password}")`;
            db_conn.insert(query2);
        });
    },

    insert_google_user : function(email, username, google_id){
        var query = `INSERT INTO user(email,username) VALUES ("${email}","${username}")`;
        db_conn.insert(query, function(response){
            var query2 = `INSERT INTO googleuser("${response}", "${google_id}")`;
            db_conn.insert(query2);
        });
    },

    get_user : function(username,callback){
        var query = `SELECT * FROM user WHERE username = "${username}"`;
        db_conn.get(query,callback);
    },

    

    exists_user : function(username,callback){
        var query = `SELECT * FROM user WHERE username = "${username}"`;
        db_conn.get(query,function(response){
            var exists = response !== undefined;
            callback(exists);
        })
    },

}