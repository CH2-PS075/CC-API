const express = require('express');
const {
    addTalent,
    getAllTalents,
    getTalentById,
    updateTalentById,
    deleteTalentById,
    addTalentToFavorites,
    searchTalentByName,
    searchTalentByCategory,
} = require('../controllers/talentController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', addTalent);
router.get('/', authenticateToken, getAllTalents);
router.get('/:id', authenticateToken, getTalentById);
router.put('/:id', authenticateToken, updateTalentById);
router.delete('/:id', authenticateToken, deleteTalentById);
router.get('/search-by-name', searchTalentByName);
router.get('/search-by-category', searchTalentByCategory);
router.post('/:id/favorite-talents/:talentId', authenticateToken, addTalentToFavorites);

module.exports = router;
