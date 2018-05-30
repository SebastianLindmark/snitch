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
    },
    wide_image_url:{
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
       title : {
            type: Sequelize.STRING
       },

       live : {
           type:Sequelize.BOOLEAN
       },
       
        viewers : {
           type: Sequelize.INTEGER
       },

       live_url : {
        type: Sequelize.STRING
       }

    });


    const VOD = sequelize.define('vod', {
        id: { 
            type: Sequelize.INTEGER, 
            autoIncrement: true,
            primaryKey: true
        },
       
        title : {
             type: Sequelize.STRING
        },
        //The path to the stream 
        path : {
            type:Sequelize.STRING
        },
        //The path to the folder of the stream
        root_path : {
            type:Sequelize.STRING
        }

     });
 



User.hasOne(Password, {as : "Password",foreignKey: 'userId'}) //userId will be added in Password model

User.hasOne(GoogleUser, {as : "GoogleUser", foreignKey: 'userId'})
User.hasOne(StreamKey, {as : "StreamKey", foreignKey: 'userId'})
StreamKey.belongsTo(User, {as : "User", foreignKey:'userId'})


User.hasOne(Channel, {as : "Channel", foreignKey: 'userId'})

User.hasOne(StreamConfig, {as : "StreamConfig", foreignKey:'userId'})
StreamConfig.belongsTo(User, {as : "User", foreignKey:'userId'})


//Stream.hasOne(StreamConfig, {as : "StreamConfig", foreignKey: 'userId'})

//Stream.hasOne(StreamKey, {through: 'ConfigStream'});
//StreamConfig.belongsTo(Stream, {through: 'ConfigStream'});


Game.hasMany(StreamConfig, {as : "StreamConfig", foreignKey: 'game' })
StreamConfig.belongsTo(Game, {as: "Game", foreignKey: 'game'})

User.hasMany(VOD, {as : {singular : 'VOD', plural : 'VODS'}, foreignKey:'userId'})
VOD.belongsTo(User, {as: "User", foreignKey: 'userId'})

Game.hasOne(VOD, {as : "VOD" , foreignKey:'game'})
VOD.belongsTo(Game, {as : "Game",foreignKey: 'game'})


Country.hasMany(StreamConfig, {as : "StreamConfig"})

//Set up followers (Many to Many relation)
//User.belongsToMany(User, {as: 'Following', through: 'followers'});
//User.belongsToMany(User, {as: 'Followers', through: 'followers'});

//User.belongsToMany(User, {as : 'Follower', through : 'FollowingTable'})
//User.belongsToMany(User, {as : 'Following', through : 'FollowingTable'})

User.belongsToMany(User, { as: {singular : 'Follower', plural : 'Followers'}, through : 'FollowTable', foreignKey: 'followerId'})
User.belongsToMany(User, { as: {singular : 'Following', plural : 'Followings'}, through : 'FollowTable', foreignKey: 'followingId' })

//User.getFollower(s) , User.setFollower
//User.getFollowing(s), User.setFollowing

//module.exports = User,Password,GoogleUser, StreamKey,Channel,Stream,StreamConfig,Country
//module.exports = sequelize        
//Create the models




function insert_static_data(){
    var games = ["Fortnite", "League of Legends", "Overwatch", "PLAYERUNKNOWN'S BATTLEGROUNDS","Dota 2", "Hearthstone","GTA V", "Destiny 2", "Tom Clancy's Rainbox Six"]
    var image_urls = ["https://static-cdn.jtvnw.net/ttv-boxart/Fortnite-285x380.jpg", "https://static-cdn.jtvnw.net/ttv-boxart/League%20of%20Legends-285x380.jpg", "https://static-cdn.jtvnw.net/ttv-boxart/Overwatch-285x380.jpg", "https://static-cdn.jtvnw.net/ttv-boxart/PLAYERUNKNOWN%27S%20BATTLEGROUNDS-285x380.jpg","https://static-cdn.jtvnw.net/ttv-boxart/Dota%202-285x380.jpg","https://static-cdn.jtvnw.net/ttv-boxart/Hearthstone-285x380.jpg","https://static-cdn.jtvnw.net/ttv-boxart/Grand%20Theft%20Auto%20V-285x380.jpg", "https://static-cdn.jtvnw.net/ttv-boxart/Destiny%202-285x380.jpg", "https://static-cdn.jtvnw.net/ttv-boxart/Tom%20Clancy%27s%20Rainbow%20Six:%20Siege-285x380.jpg"]
    var wide_image_url = ["https://static-cdn.jtvnw.net/community-images/26d866a4-a30d-424c-b25a-cc99466d42fa/fff01bbe-2f5c-4216-846e-d0946057154b-1200x180.jpeg","https://static-cdn.jtvnw.net/community-images/6a723096-3135-4972-a296-ecd3b08be1ad/fa79e187-6dad-414a-b410-07b11093fc76-1200x180.jpeg","https://static-cdn.jtvnw.net/community-images/0b9c1e27-bac5-4dfb-985c-ceb54f08f072/5cb8aa1f-2526-48ad-bb12-6b63291adec9-1200x180.png","https://static-cdn.jtvnw.net/community-images/088c0a99-4aee-4fa0-a0fc-954293dabcfd/791d9f22-962a-473a-adab-8b9460330663-1200x180.png","https://static-cdn.jtvnw.net/community-images/cfbc881f-3e02-4d7c-bf15-efa905522236/a53210e8-59b3-4879-b1e3-b9902eab293a-1200x180.png", "https://static-cdn.jtvnw.net/community-images/227e76f0-66e7-47c5-9653-cf26e7790bde/0671053f-9bc3-4633-aa15-9e95441ae5db-1200x180.png","https://static-cdn.jtvnw.net/community-images/2fa75b53-3c09-44a8-8668-da22c7a60ba4/01699f1e-375e-4bf4-9c1c-a269b8a2c4e4-1200x180.png","https://static-cdn.jtvnw.net/community-images/11138eda-4be3-4df4-9761-eae075e5433b/043d77f8-96bd-4222-9bb5-bb6f82076243-1200x180.jpeg","https://static-cdn.jtvnw.net/community-images/26af0d17-7dc9-4f1b-9339-06ddd0085105/f82b881b-d16a-4cf9-a301-bc3692df5bb2-1200x180.jpeg"]
    var countries = ["USA","Sweden","Ireland","Italy","France","Finland","Norway"]

    for(var i = 0; i < games.length; i++){
        Game.create({name:games[i], url:image_urls[i], wide_image_url: wide_image_url[i]})
    }
    
    for(var i = 0; i < games.length; i++){
        Country.create({name:countries[i]})
    }

    console.log("Static data inserted")
}


models = {'sequelize' : sequelize, 'User' : User, 'Password' : Password, "GoogleUser" : GoogleUser, "StreamKey" : StreamKey,"StreamConfig": StreamConfig, "Game":Game,"Country":Country,"VOD":VOD, "insertStaticData" : insert_static_data}
module.exports = models


