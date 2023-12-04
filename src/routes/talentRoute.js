const express = require('express');
const {
    addTalent,
    getAllTalents,
    getTalentById,
    updateTalentById,
    deleteTalentById,
    addTalentToFavorites,
} = require('../controllers/talentController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', addTalent);
router.get('/', authenticateToken, getAllTalents);
router.get('/:id', authenticateToken, getTalentById);
router.put('/:id', authenticateToken, updateTalentById);
router.delete('/:id', authenticateToken, deleteTalentById);
router.post('/:id/favorite-talents/:talentId', authenticateToken, addTalentToFavorites);

module.exports = router;
