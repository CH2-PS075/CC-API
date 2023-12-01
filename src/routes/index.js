const express = require('express');
const userRoute = require('./userRoute');
const authRoute = require('./authRoute');

const router = express.Router();

router.use('/users', userRoute);
router.use('/auth', authRoute);

module.exports = router;
