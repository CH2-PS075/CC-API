const express = require('express');
const {
    addTalent,
    getAllTalents,
    getTalentById,
    updateTalentById,
    deleteTalentById,
    addTalentToFavorites,
    searchTalents,
} = require('../controllers/talentController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/search', searchTalents);
router.post('/', addTalent);
router.get('/', getAllTalents);
router.get('/:id', authenticateToken, getTalentById);
router.put('/:id', authenticateToken, updateTalentById);
router.delete('/:id', authenticateToken, deleteTalentById);
router.post('/:id/favorite-talents/:talentId', authenticateToken, addTalentToFavorites);

module.exports = router;
