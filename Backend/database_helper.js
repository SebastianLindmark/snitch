const sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./db.sqlite3');

module.exports = {
    database : require("./db_helpers/db_conn"),
    user : require("./db_helpers/user"),
    channel : require("./db_helpers/channel"),

    reset_database : function(){
        this.database.drop_tables();
    }
};
