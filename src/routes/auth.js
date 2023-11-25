const express = require('express');
const authController = require('../controllers/auth'); // Assuming your auth controller is in this path

const router = express.Router();

// Use the authController router for '/auth' endpoints
router.use('/auth', authController);

module.exports = router;
