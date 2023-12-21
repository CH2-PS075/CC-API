const express = require('express');
const multer = require('multer');
const {
    addUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    getFavoriteTalentsForUser,
    sendMessage,
} = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();
const upload = multer();

router.post('/', addUser);
router.post('/send-message', upload.none(), sendMessage);
router.get('/', authenticateToken, getAllUsers);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUserById);
router.delete('/:id', authenticateToken, deleteUserById);
router.get('/:id/favorite-talents', getFavoriteTalentsForUser);

module.exports = router;
