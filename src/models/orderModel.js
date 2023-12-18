const { Sequelize } = require('sequelize');
const dbConnection = require('../config/database');
const User = require('./userModel');
const Talent = require('./talentModel');

const { DataTypes } = Sequelize;

const Order = dbConnection.define('tb_orders', {
    orderId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    orderedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'tb_users',
            key: 'userId',
        },
    },
    talentId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'tb_talents',
            key: 'talentId',
        },
    },
}, {
    freezeTableName: true,
});

// Relations
Order.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Order, { foreignKey: 'userId' });

Order.belongsTo(Talent, { foreignKey: 'talentId' });
Talent.hasMany(Order, { foreignKey: 'talentId' });

module.exports = Order;

(async () => {
    await dbConnection.sync();
})();
