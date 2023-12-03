const { Sequelize } = require('sequelize');
const dbConnection = require('../config/database');

const { DataTypes } = Sequelize;

const User = dbConnection.define(
  'tb_users',
  {
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.TEXT,
    },
    contact: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
    },
    picture: {
      type: DataTypes.STRING,
      defaultValue: 'public/assets/default-profile.jpg',
    },
  },
  {
    freezeTableName: true,
  },
);

module.exports = User;

(async () => {
  await dbConnection.sync();
})();
