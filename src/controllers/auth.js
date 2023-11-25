const express = require('express');

const router = express.Router();

// REGISTER TALENT
router.post('/register', (req, res) => {
  // Logic for handling login request
  res.send('register new talent');
});

// LOGGING IN
router.post('/login', (req, res) => {
  // Logic for handling login request
  res.send('login as a talent');
});

module.exports = router;
