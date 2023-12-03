const { Sequelize } = require('sequelize');
const dbConnection = require('../config/database');

const { DataTypes } = Sequelize;

const Admin = dbConnection.define(
    'tb_admin',
    {
        adminId: {
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
        email: {
            type: DataTypes.STRING,
            unique: true,
            validate: { isEmail: true },
        },
        password: {
            type: DataTypes.STRING,
        },
    },
    {
        freezeTableName: true,
    },
);

module.exports = Admin;

(async () => {
    await dbConnection.sync();
})();
