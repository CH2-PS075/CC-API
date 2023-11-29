require('dotenv').config();

const config = {
  port: process.env.PORT,
  userDatabase: process.env.USERNAME_DATABASE,
  passDatabase: process.env.PASSWORD_DATABASE,
  databaseName: process.env.DATABASE_NAME,
};

module.exports = config;
