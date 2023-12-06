const express = require('express');
const { loginUser, loginAdmin, loginTalent } = require('../controllers/authController');

const router = express.Router();

router.post('/user/login', loginUser);
router.post('/admin/login', loginAdmin);
router.post('/talent/login', loginTalent);

module.exports = router;
