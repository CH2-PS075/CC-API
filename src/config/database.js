const { Sequelize } = require('sequelize');
const config = require('./config');

const dbConnection = new Sequelize(
  `${config.databaseName}`,
  `${config.userDatabase}`,
  `${config.passDatabase}`,
  {
    host: 'localhost',
    dialect: 'mysql',
  }
);

module.exports = dbConnection;
