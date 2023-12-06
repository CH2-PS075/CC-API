const express = require('express');
const {
    verifyTalent,
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
} = require('../controllers/adminController');
// const { isAdmin } = require('../middlewares/adminMiddleware');

const router = express.Router();

router.post('/verify/:talentId', verifyTalent);
router.post('/categories', createCategory);
router.get('/categories', getAllCategories);
router.put('/categories', updateCategory);
router.delete('/categories/:categoryId', deleteCategory);

module.exports = router;
