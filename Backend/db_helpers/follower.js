var user = require("./user");

module.exports = {


    //db.run('CREATE TABLE follower(user INTEGER, following INTEGER, PRIMARY KEY(user, following), FOREIGN KEY(user) REFERENCES user(id),FOREIGN KEY(following) REFERENCES user(id));', insert_test_data);

    //username should follow object_username
    insert_follower : function(username,object_username){
        var step1 = user.get_user(username);
        var step2 = user.get_user(object_username);
        
        return Promise.all([step1,step2]).then(function([resA,resB]){
            var query = `INSERT INTO follower(user,following) VALUES ("${resA.id}","${resB.id}")`;
            return db_conn.get(query);    
        });        
    },

    get_followers : function(username){
        
        var query = `SELECT * FROM follower WHERE user = (SELECT id from user WHERE id = "${username}")`;
        return db_conn.get(query).then(rows =>{
            var result = [];
            rows.forEach((row) => {
                user.get_user_id(row.following).then(user =>{
                    result.push(user);
                });
            });
            return result;
        });
    },

    //is username folloing object_username
    is_follower : function(username, object_username){
        var step1 = user.get_user(username);
        var step2 = user.get_user(object_username);
        
        return Promise.all([step1,step2]).then(function([resA,resB]){
            var query = `SELECT * FROM follower WHERE user = "${resA.id}" and following = "${resB.id}"`;
            return db_conn.get(query);
        });
    }
}