const Sequelize = require("sequelize");
var sequelize = require('./db_conn_sequelize').sequelize;

const User = sequelize.define('user', {
    id: { 
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true 
    },
    email: {
        type: Sequelize.STRING,
        unique : true
    },
    username: {
        type: Sequelize.STRING,
        unique : true
    }
  });

 const Password = sequelize.define('password', {
    id: { 
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true 
    },
    pwd: {
        type: Sequelize.STRING
    }
  });

  //db.run('CREATE TABLE googleuser(id INTEGER PRIMARY KEY, token TEXT UNIQUE, FOREIGN KEY(id) REFERENCES user(id));');
  
  const GoogleUser = sequelize.define('googleuser', {
   
    token: {
        type: Sequelize.STRING,
        unique : true
    }
  });


  //db.run('CREATE TABLE streamkey(id INTEGER PRIMARY KEY, key TEXT UNIQUE, FOREIGN KEY(id) REFERENCES user(id));');

  const StreamKey = sequelize.define('streamkey', {
  
    key: {
        type: Sequelize.STRING,
        unique : true
    }
  });

  //db.run('CREATE TABLE channel(id INTEGER PRIMARY KEY, biography TEXT,FOREIGN KEY(id) REFERENCES user(id));');

  
  const Channel = sequelize.define('channel', {
    
    biography: {
        type: Sequelize.STRING
    }
  }); 

    //db.run('CREATE TABLE stream(id INTEGER PRIMARY KEY, viewers INTEGER, FOREIGN KEY(id) REFERENCES user(id));');


    //db.run('CREATE TABLE game(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, url TEXT);');

    const Game = sequelize.define('game', {
        id: { 
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true 
    },
    name: {
        type: Sequelize.STRING,
        unique : true
    },
    url: {
        type: Sequelize.STRING
    }
    });

    
    
    //db.run('CREATE TABLE country(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE);');
   const Country = sequelize.define('country', {
        id: { 
            type: Sequelize.INTEGER, 
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            unique: true
        }
      }); 
      
    
    //db.run('CREATE TABLE stream_config(id INTEGER PRIMARY KEY, game INTEGER,title TEXT, FOREIGN KEY(id) REFERENCES stream(id),FOREIGN KEY(game) REFERENCES channel(id));');

    const StreamConfig = sequelize.define('streamconfig', {
       biography : {
            type: Sequelize.STRING
       },

       live : {
           type:Sequelize.BOOLEAN
       },
       
        viewers : {
           type: Sequelize.INTEGER
       }
    });


    //db.run('CREATE TABLE follower(user INTEGER, following INTEGER, PRIMARY KEY(user, following), FOREIGN KEY(user) REFERENCES user(id),FOREIGN KEY(following) REFERENCES user(id));', insert_test_data);
//UNCOMMENT HERE

User.hasOne(Password, {as : "Password",foreignKey: 'userId'}) //userId will be added in Password model

User.hasOne(GoogleUser, {as : "GoogleUser", foreignKey: 'userId'})
User.hasOne(StreamKey, {as : "StreamKey", foreignKey: 'userId'})

User.hasOne(Channel, {as : "Channel", foreignKey: 'userId'})

User.hasOne(StreamConfig, {as : "StreamConfig", foreignKey:'userId'})

//Stream.hasOne(StreamConfig, {as : "StreamConfig", foreignKey: 'userId'})

//Stream.hasOne(StreamKey, {through: 'ConfigStream'});
//StreamConfig.belongsTo(Stream, {through: 'ConfigStream'});


Game.hasMany(StreamConfig, {as : "StreamConfig", foreignKey: 'game' }) //Is this correct?
StreamConfig.belongsTo(Game, {as: "Game", foreignKey: 'game'})



Country.hasMany(StreamConfig, {as : "StreamConfig"})

//Set up followers (Many to Many relation)
//User.belongsToMany(User, {as: 'Following', through: 'followers'});
//User.belongsToMany(User, {as: 'Followers', through: 'followers'});

User.hasMany(User, {as : 'Follower'})
User.hasMany(User, {as : 'Following'})
//UNCOMMENT HERE


//module.exports = User,Password,GoogleUser, StreamKey,Channel,Stream,StreamConfig,Country
//module.exports = sequelize        
//Create the models

/*var func1 = this.test_create_user_with_google_account;
var func2 = this.test_create_user_with_stream_key;
this.test_create_user_with_password(User,Password).then(function(){
    return func1(User,GoogleUser)
}).then(function(){
    return func2(User,StreamKey)
})*/

function insert_static_data(){
    var games = ["Fortnite", "League of Legends", "Overwatch", "PLAYERSUNKNOWN'S BATTLEGROUNDS","Dota 2", "Hearthstone","GTA V"]
    var image_urls = ["https://static-cdn.jtvnw.net/ttv-boxart/Fortnite-285x380.jpg", "https://static-cdn.jtvnw.net/ttv-boxart/League%20of%20Legends-285x380.jpg", "https://static-cdn.jtvnw.net/ttv-boxart/Overwatch-285x380.jpg", "https://static-cdn.jtvnw.net/ttv-boxart/PLAYERUNKNOWN%27S%20BATTLEGROUNDS-285x380.jpg","https://static-cdn.jtvnw.net/ttv-boxart/Dota%202-285x380.jpg","https://static-cdn.jtvnw.net/ttv-boxart/Hearthstone-285x380.jpg","https://static-cdn.jtvnw.net/ttv-boxart/Grand%20Theft%20Auto%20V-285x380.jpg"]
    var countries = ["USA","Sweden","Ireland","Italy","France","Finland","Norway"]

    for(var i = 0; i < games.length; i++){
        Game.create({name:games[i], url:image_urls[i]})
    }
    
    for(var i = 0; i < games.length; i++){
        Country.create({name:countries[i]})
    }
    console.log("Static data inserted")
}




models = {'sequelize' : sequelize, 'User' : User, 'Password' : Password, "GoogleUser" : GoogleUser, "StreamKey" : StreamKey,"StreamConfig": StreamConfig, "Game":Game,"Country":Country, "insertStaticData" : insert_static_data}
module.exports = models



    //db.run('CREATE TABLE user(id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, username TEXT UNIQUE);');
    //db.run('CREATE TABLE password(id INTEGER PRIMARY KEY, password TEXT, FOREIGN KEY(id) REFERENCES user(id));');

    


/*
return User.findById(1).then(user => {
                //user.setPassword(pwd)
                console.log("Created password field");
            }, err => {
                console.log("Received err")
                console.log(err)
            })

*/

/*
 test_create_user_with_password : function(User, Password){
        return sequelize.sync({force: true})
        .then(function(){
            return User.create({id : 1337,email : 'sebbe.lindmark@gmail.com', username : 'UncleSeb'})})
        .then(function(user){
            return Password.create({pwd:'Secret'})
            .then(pwd => {            
                user.setPassword(pwd);
                })
            })
            .then(password => {
                return User.findById(1337)
            })
            .then(user => {
                return user.getPassword()
            }).then(password => {
                if(password !== undefined){
                    console.log("User password: Success. Password is " + password.pwd)
                }
            })
            .catch(reason => {
                console.log(reason);
            })
    },

    test_create_user_with_google_account : function(User, GoogleUser){
        return sequelize.sync({force: true})
        .then(function(){return User.create({id : 1337,email : 'sebbe.lindmark@gmail.com', username : 'UncleSeb'})})
        .then(function(user){
            return GoogleUser.create({token:'my-secret-token'})
            .then(googleUser => {            
                user.setGoogle(googleUser);
                })
            })
            .then(password => {
                return User.findById(1337)
            })
            .then(user => {
                return user.getGoogle()
            }).then(googleUser => {
                if(googleUser !== undefined){
                    console.log("User GoogleUser: Sucess. Token is " + googleUser.token)
                }
            })
            .catch(reason => {
                console.log(reason);
            })
    },

    test_create_user_with_stream_key : function(User, StreamKey){
        return sequelize.sync({force: true})
        .then(function(){return User.create({id : 1337,email : 'sebbe.lindmark@gmail.com', username : 'UncleSeb'})})
        .then(function(user){
            return StreamKey.create({key:'my-secret-key'})
            .then(streamkey => {            
                user.setStreamKey(streamkey);
                })
            })
            .then(streamkey => {
                return User.findById(1337)
            })
            .then(user => {
                return user.getStreamKey()
            }).then(streamKey => {
                if(streamKey !== undefined){
                    console.log("User Streamkey: Sucess. Key is " + streamKey.key)
                }
            })
            .catch(reason => {
                console.log(reason);
            })
    }


*/

