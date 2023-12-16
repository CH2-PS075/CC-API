const express = require('express');
const multer = require('multer');
const authRoute = require('./authRoute');
const adminRoute = require('./adminRoute');
const talentRoute = require('./talentRoute');
const userRoute = require('./userRoute');

const router = express.Router();
const upload = multer();

router.use('/auth', upload.none(), authRoute);
router.use('/admin', adminRoute);
router.use('/talents', talentRoute);
router.use('/users', userRoute);

module.exports = router;
