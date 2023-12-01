const { Sequelize } = require('sequelize');
const dbConnection = require('../config/database');

const { DataTypes } = Sequelize;

const Talent = dbConnection.define(
  'tb_talent',
  {
    talentId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    talentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.ENUM('single', 'duo', 'group'),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    identityCard: {
      type: DataTypes.STRING,
    },
    paymentConfirmationReceipt: {
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
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    picture: {
      type: DataTypes.STRING,
      defaultValue: '.png',
    },
    portfolio: {
      type: DataTypes.STRING,
    },
    latitude: {
      type: DataTypes.INTEGER,
      validate: {
        min: -90,
        max: 90,
      },
    },
    longitude: {
      type: DataTypes.INTEGER,
      validate: {
        min: -180,
        max: 180,
      },
    },
  },
  {
    freezeTableName: true,
  },
);

module.exports = Talent;

(async () => {
  await dbConnection.sync();
