const { Sequelize } = require('sequelize');
const dbConnection = require('../config/database');

const { DataTypes } = Sequelize;

const User = dbConnection.define(
  'users',
  {
    nama_lengkap: DataTypes.STRING,
    username: DataTypes.STRING,
    alamat: DataTypes.STRING,
    telpon: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  },
);

module.exports = User;

(async () => {
  await dbConnection.sync();
})();
