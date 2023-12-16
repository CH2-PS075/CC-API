const express = require('express');
const {
    verifyTalent,
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
} = require('../controllers/adminController');
const isAdmin = require('../middlewares/adminMiddleware');
// const { isAdmin } = require('../middlewares/adminMiddleware');

const router = express.Router();

router.post('/verify/:talentId', isAdmin, verifyTalent);
router.post('/categories', isAdmin, createCategory);
router.get('/categories', isAdmin, getAllCategories);
router.put('/categories', isAdmin, updateCategory);
router.delete('/categories/:categoryId', isAdmin, deleteCategory);

module.exports = router;
