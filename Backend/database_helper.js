const sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./db.sqlite3');

module.exports = {
 

    reset_database : function(){
        //this.database.drop_tables();
    }
};
