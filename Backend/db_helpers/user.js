var db_conn = require("./db_conn");



module.exports = {

   get_streamkey : function(username){
       return this.get_user(username).then(function(row){
           var query = `SELECT key FROM streamkey WHERE id="${row.id}"`;
           return db_conn.get(query);
       });
   },

   insert_streamkey : function(username, key){
        return this.get_user(username).then(function(row){
            var query = `INSERT INTO streamkey(id,key) VALUES ("${row.id}","${key}")`;
            return db_conn.insert(query);
        });
   },

    get_user : function(username){ 
        var query = `SELECT * FROM user WHERE username = "${username}"`;
        return db_conn.get(query);
    },

    get_user_id : function(id){
        var query = `SELECT * FROM user WHERE id = "${id}"`;
        return db_conn.get(query);
    },

    get_google_user : function(username, googleID){
        var query = `SELECT * FROM googleuser WHERE token= "${googleID}"`;
        return db_conn.get(query);
    },

    insert_google_user : function(email,username,google_id){
        var query = `INSERT INTO user(email,username) VALUES ("${email}","${username}")`;
        return db_conn.insert(query).then(function(rowID){
            query = `INSERT INTO googleuser(id,token) VALUES("${rowID}", "${google_id}")`;
            return db_conn.insert(query);
        });
    },

    exists_google_user : function(google_id){
        var query = `SELECT * FROM googleuser WHERE token = "${username}"`;
        return db_conn.get(query);
    },

    get_user_password : function(id){
        var query = `SELECT * FROM password WHERE id = "${id}"`;
        return db_conn.get(query);
    },

    exists_user : function(username){
        var query = `SELECT * FROM user WHERE username = "${username}"`;
        return db_conn.get(query);
    },       
    
    insert_user : function(email,username,password){
        var query = `INSERT INTO user(email,username) VALUES ("${email}","${username}")`;
        return db_conn.insert(query).then(function(response){
            query = `INSERT INTO password(id,password) VALUES ("${response}", "${password}")`;
            return db_conn.insert(query);
        });
    }

}