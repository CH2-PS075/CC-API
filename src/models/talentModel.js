const { Sequelize } = require('sequelize');
const dbConnection = require('../config/database');
const { Category } = require('./categoryModel');

const { DataTypes } = Sequelize;

const Talent = dbConnection.define(
  'tb_talent',
  {
    talentId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tb_categories',
        key: 'categoryId',
      },
    },
    talentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.ENUM('single', 'duo', 'group'),
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

Category.hasMany(Talent, {
  foreignKey: 'categoryId',
  as: 'talents',
  onUpdate: 'SET NULL',
  onDelete: 'SET NULL',
});
Talent.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
});

module.exports = Talent;

(async () => {
  await dbConnection.sync();
})();
