const express = require('express');
const { loginUser, loginAdmin, loginTalent } = require('../controllers/authController');

const router = express.Router();

router.post('/users/login', loginUser);
router.post('/admin/login', loginAdmin);
router.post('/talents/login', loginTalent);

module.exports = router;
