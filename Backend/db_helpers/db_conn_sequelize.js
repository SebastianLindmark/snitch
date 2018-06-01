/**
 * The base class for Sequelize. This is where configurations for the ORM can be made, such as logging and database location.
 * Can later easily be changed to a more advanced database, such as postgresql.
 */


const Sequelize = require("sequelize");
const sequelize = new Sequelize('database','username','password',{
    host: 'localhost',
    dialect: 'sqlite',
    operatorsAliases: false,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },

    // SQLite only
    storage: 'db_helpers/sequalize_db.sqlite3'
});

//Tests the connection to the database by authenticating.
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to database has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


  module.exports = {
      sequelize
  }