const { Sequelize } = require('sequelize');
const dbConnection = require('../config/database');

const { DataTypes } = Sequelize;

const Category = dbConnection.define(
    'tb_categories',
    {
        categoryId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        detailCategoryId: {
            type: DataTypes.INTEGER,
        },
        categoryName: {
            type: DataTypes.STRING,
        },
    },
    {
        freezeTableName: true,
    },
);

const detailCategory = dbConnection.define(
    'tb_detail_categories',
    {
        detailCategoryId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        detailCategoryName: {
            type: DataTypes.STRING,
        },
    },
    {
        freezeTableName: true,
    },
);

detailCategory.belongsTo(Category, {
    foreignKey: 'id_kategori',
    as: 'category',
});
Category.hasOne(detailCategory, {
    foreignKey: 'id_kategori',
    as: 'detailCategory',
});

module.exports = { Category, detailCategory };

(async () => {
    await dbConnection.sync();
})();
