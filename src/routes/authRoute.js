const express = require('express');
const { loginUser, loginAdmin } = require('../controllers/authController');

const router = express.Router();

router.post('/login', loginUser);
router.post('/login', loginAdmin);

module.exports = router;
