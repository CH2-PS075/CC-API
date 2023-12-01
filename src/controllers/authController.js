const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const config = require('../config/config');

// LOGIN USER
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // IF SUCCES GENERATE JWT TOKEN
    const token = jwt.sign({ userId: user.id }, config.accessTokenSecret, { expiresIn: '1d' });
    const message = 'Login successful';

    return res.status(200).json({ token, message });
  } catch (error) {
    return res.status(500).json({ error: 'Login failed' });
  }
};

module.exports = {
  loginUser,
};
