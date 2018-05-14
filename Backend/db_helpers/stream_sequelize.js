var models = require("./models");

module.exports = {
    create_stream : function(user) {
        models.Stream.create({})        
    }
}