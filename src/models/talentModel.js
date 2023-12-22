const { Sequelize } = require('sequelize');
const dbConnection = require('../config/database');
// const { detailCategory } = require('./categoryModel');

const { DataTypes } = Sequelize;

const Talent = dbConnection.define(
  'tb_talents',
  {
    talentId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // detailCategoryId: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: 'tb_detail_categories',
    //     key: 'detailCategoryId',
    //   },
    // },
    talentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.ENUM('single', 'duo', 'group'),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    identityVerification: {
      type: DataTypes.STRING,
    },
    // // paymentConfirmationReceipt: {
    // //   type: DataTypes.STRING,
    // // },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // isVerified: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: 0,
    // },
    picture: {
      type: DataTypes.TEXT,
    },
    portfolio: {
      type: DataTypes.TEXT,
    },
    latitude: {
      type: DataTypes.FLOAT,
      validate: {
        min: -90,
        max: 90,
      },
    },
    longitude: {
      type: DataTypes.FLOAT,
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

// detailCategory.hasMany(Talent, {
//   foreignKey: 'detailCategoryId',
//   as: 'talents',
//   onUpdate: 'SET NULL',
//   onDelete: 'SET NULL',
// });
// Talent.belongsTo(detailCategory, {
//   foreignKey: 'detailCategoryId',
//   as: 'detailCategory',
// });

module.exports = Talent;

(async () => {
  await dbConnection.sync();
})();
