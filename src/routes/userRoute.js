const express = require('express');
const {
    addUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    userUploadPicture,
    getFavoriteTalentsForUser,
} = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', addUser);
router.get('/', authenticateToken, getAllUsers);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUserById);
router.delete('/:id', authenticateToken, deleteUserById);
router.post('/:id/picture', authenticateToken, userUploadPicture);
router.get('/:id/favorite-talents', getFavoriteTalentsForUser);

module.exports = router;
