require('dotenv').config();

const config = {
  port: process.env.PORT,
  userDatabase: process.env.USERNAME_DATABASE,
  passDatabase: process.env.PASSWORD_DATABASE,
  databaseName: process.env.DATABASE_NAME,
  databaseHost: process.env.DATABASE_HOST,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  projectIdGCP: process.env.PROJECT_ID_GCP,
  bucketName: process.env.BUCKET_NAME,
  faceValidateUrl: process.env.FACEVALIDATE_URL,
  chatBotUrl: process.env.CHATBOT_URL,
  recommendUrl: process.env.RECOMMEND_URL,
};

module.exports = config;
