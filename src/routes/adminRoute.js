const express = require('express');
const { verifyTalent } = require('../controllers/adminController');

const router = express.Router();

router.post('/verify/:talentId', verifyTalent);

module.exports = router;
