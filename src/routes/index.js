const express = require('express');
const authRoute = require('./authRoute');
const adminRoute = require('./adminRoute');
const talentRoute = require('./talentRoute');
const userRoute = require('./userRoute');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/admin', adminRoute);
router.use('/talent', talentRoute);
router.use('/users', userRoute);

module.exports = router;
