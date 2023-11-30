// models/talentModel.js
const { Sequelize } = require('sequelize');
const dbConnection = require('../config/database');

const { DataTypes } = Sequelize;

const Talent = dbConnection.define('Talent', {
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
    type: DataTypes.STRING, // You can use a data type suitable for storing file paths or references
  },
  paymentConfirmationReceipt: {
    type: DataTypes.STRING, // Similar to identityCard, store file paths or references
  },
});

module.exports = Talent;
