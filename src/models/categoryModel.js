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
        categoryName: {
            type: DataTypes.ENUM('Musik dan Hiburan', 'Edukasi', 'Seniman', 'Teater dan Aktor'),
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

Category.hasMany(detailCategory, {
    foreignKey: 'categoryId',
    as: 'detailCategory',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
});
detailCategory.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category',
});

async function seedDatabase() {
    const categoriesData = [
        {
            name: 'Musik dan Hiburan',
            detail: [
                'Penyanyi',
                'Band (Berbagai genre)',
                'Band Akustik',
                'DJ',
                'Komedian',
                'Ilusionis atau Pesulap',
                'Penari (Berbagai jenis tarian)',
                'MC (Pembawa Acara)',
                'Moderator',
            ],
        },
        { name: 'Edukasi', detail: ['Narasumber / Speaker'] },
        {
            name: 'Seniman',
            detail: [
                'Seniman Lukisan',
                'Seniman Patung',
                'Fotografer',
                'Seniman Graffiti',
                'Karikaturis',
                'Seni Pertunjukan Lainnya',
            ],
        },
        {
            name: 'Teater dan Aktor',
            detail: ['Seniman Seni Pertunjukan (Circus, Fire - Dancing, dll.)', 'Seniman Pantomim'],
        },
    ];

    // eslint-disable-next-line no-restricted-syntax
    for (const categoryData of categoriesData) {
        // eslint-disable-next-line no-await-in-loop
        const [category, created] = await Category.findOrCreate({
            where: { categoryName: categoryData.name },
            defaults: { categoryName: categoryData.name },
        });

        if (created) {
            // eslint-disable-next-line no-restricted-syntax
            for (const detailName of categoryData.detail) {
                // eslint-disable-next-line no-await-in-loop
                await detailCategory.create({
                    detailCategoryName: detailName,
                    categoryId: category.categoryId,
                });
            }
        }
    }
}

module.exports = { Category, detailCategory };

(async () => {
    await dbConnection.sync();
    await seedDatabase();
})();
