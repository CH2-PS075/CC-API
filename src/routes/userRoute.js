// routes/userRoute.js

const express = require('express');
const { createUser, getAllUsers } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', createUser);
router.get('/getAll', authenticateToken, getAllUsers);

module.exports = router;
