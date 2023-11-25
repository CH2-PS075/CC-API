const express = require('express');

const router = express.Router();

// GET ALL REGISTERED TALENT
router.get('/getAllTalent', (req, res) => {
  // Logic for handling login request
  res.send('getting all registered talent');
});

module.exports = router;
