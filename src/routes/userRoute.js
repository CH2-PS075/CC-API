const express = require('express');
const {
    addUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    getFavoriteTalentsForUser,
} = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', addUser);
router.get('/', authenticateToken, getAllUsers);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUserById);
router.delete('/:id', authenticateToken, deleteUserById);
router.get('/:id/favorite-talents', getFavoriteTalentsForUser);

module.exports = router;
