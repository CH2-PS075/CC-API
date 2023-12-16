const Talent = require('../models/talentModel');
const { Category, detailCategory } = require('../models/categoryModel'); // Update path as needed

// Verification for talent
const verifyTalent = async (req, res) => {
    try {
        const { talentId } = req.params;

        const updated = await Talent.update({ isVerified: true }, {
            where: { talentId },
        });

        if (updated[0] > 0) {
            res.status(200).json({ message: 'Talent verified successfully' });
        } else {
            res.status(404).json({ message: 'Talent not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Verification failed', details: error.message });
    }
};

// Create Category
const createCategory = async (req, res) => {
    try {
        const { categoryName, detailCategoryName } = req.body;
        const newCategory = await Category.create({ categoryName });

        if (detailCategoryName) {
            await detailCategory.create({
                detailCategoryName,
                categoryId: newCategory.categoryId,
            });
        }

        res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
        res.status(400).json({ error: 'Error creating category', details: error.message });
    }
};

// Read Categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({ include: 'detailCategory' });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching categories', details: error.message });
    }
};

// Update Category
const updateCategory = async (req, res) => {
    try {
        const { categoryId, categoryName, detailCategoryName } = req.body;
        const category = await Category.findByPk(categoryId);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        category.categoryName = categoryName;
        await category.save();

        if (detailCategoryName) {
            const detail = await detailCategory.findOne({ where: { categoryId } });
            detail.detailCategoryName = detailCategoryName;
            await detail.save();
        }

        return res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
        return res.status(400).json({ error: 'Error updating category', details: error.message });
    }
};

// Delete Category
const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findByPk(categoryId);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        await category.destroy();
        return res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Error deleting category', details: error.message });
    }
};

module.exports = {
    verifyTalent,
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
};
