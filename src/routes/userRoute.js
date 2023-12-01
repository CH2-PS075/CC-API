const express = require('express');
const {
    addUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
} = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/users', addUser);
router.get('/users', authenticateToken, getAllUsers);
router.get('/users/:id', authenticateToken, getUserById);
router.put('/users/:id', authenticateToken, updateUserById);
router.delete('/users/:id', authenticateToken, deleteUserById);

module.exports = router;
