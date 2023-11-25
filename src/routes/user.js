const express = require('express');
const userController = require('../controllers/user'); // Assuming your auth controller is in this path

const router = express.Router();

// Use the authController router for '/auth' endpoints
router.use('/user', userController);

module.exports = router;
