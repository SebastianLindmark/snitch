var user = require("./user");
var db_conn = require("./db_conn");



module.exports = {

    get_channel : function(username){
        var query = `SELECT * from channel where id = (SELECT id from user where id= "${username}")`;
        return db_conn.get(query);
    },

    insert_channel : function(){
        var query = `INSERT INTO channel(id,biography) VALUES ("${id}","${biography}")`;
        return db_conn.insert(query);
    },
    
    //db.run('CREATE TABLE channel(id INTEGER PRIMARY KEY, biography TEXT,FOREIGN KEY(id) REFERENCES user(id));');
    //db.run('CREATE TABLE stream(id INTEGER PRIMARY KEY, viewers INTEGER, FOREIGN KEY(id) REFERENCES user(id));');
    //db.run('CREATE TABLE stream_config(id INTEGER PRIMARY KEY, game INTEGER,title TEXT, FOREIGN KEY(id) REFERENCES stream(id),FOREIGN KEY(game) REFERENCES channel(id));');
        
    

    update_channel : function(id,biography){
        var query = `UPDATE channel SET biography = "${biography}" WHERE id = "${id}")`;
        return db_conn.insert(query);
    },


    create_channel : function(username,biography){
        
        //Check if channel already exists
        return this.get_channel(username).then(res => {
            if(res !== undefined){
                //Bad way to abort chain
                throw [200,"Channel already exists"];
            }
            return get_user(username);
        }).then(res => {
            return this.insert_channel(res.id,biography);
        })

    }
}