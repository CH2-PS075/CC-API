const express = require('express');
const {
    addTalent,
    getAllTalents,
    getTalentById,
    updateTalentById,
    deleteTalentById,
} = require('../controllers/talentController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', addTalent);
router.get('/', authenticateToken, getAllTalents);
router.get('/:id', authenticateToken, getTalentById);
router.put('/:id', authenticateToken, updateTalentById);
router.delete('/:id', authenticateToken, deleteTalentById);

module.exports = router;
