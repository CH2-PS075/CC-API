const express = require('express');
const { addTalent } = require('../controllers/talentController');

const router = express.Router();

router.post('/', addTalent);

module.exports = router;
