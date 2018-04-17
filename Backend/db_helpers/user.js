var db_conn = require("./db_conn");



module.exports = {

    insert_user : function(email,username,password){
        var query = `INSERT INTO user(email,username,password) VALUES ("${email}","${username}","${password}")`
        db_conn.insert(query);
    },


    get_user : function(username,callback){
        var query = `SELECT * FROM user WHERE username = "${username}"`;
        db_conn.get(query,callback);
        
    },


    exists_user : function(username){
        
    },

}