const express = require('express');
const multer = require('multer');
const {
    addTalent,
    getAllTalents,
    getTalentById,
    updateTalentById,
    deleteTalentById,
    addTalentToFavorites,
    searchTalents,
    sendPredictionRequest,
} = require('../controllers/talentController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();
const upload = multer();

router.post('/recommendation', upload.none(), sendPredictionRequest);
router.get('/search', searchTalents);
router.post('/', addTalent);
router.get('/', getAllTalents);
router.get('/:id', authenticateToken, getTalentById);
router.put('/:id', authenticateToken, updateTalentById);
router.delete('/:id', authenticateToken, deleteTalentById);
router.post('/:id/favorite-talents/:talentId', authenticateToken, addTalentToFavorites);

module.exports = router;
