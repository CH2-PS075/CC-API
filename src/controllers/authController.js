const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const User = require('../models/userModel');
const Talent = require('../models/talentModel');
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

    return res.status(200).json({
      token, message, username: user.username, contact: user.contact, address: user.address,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Login failed' });
  }
};

// LOGIN ADMIN
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // IF SUCCES GENERATE JWT TOKEN
    const token = jwt.sign({ adminId: admin.id }, config.accessTokenSecret, { expiresIn: '1d' });
    const message = 'Login successful';

    return res.status(200).json({ token, message });
  } catch (error) {
    return res.status(500).json({ error: 'Login failed' });
  }
};

// LOGIN TALENT
const loginTalent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const talent = await Talent.findOne({ where: { email } });

    if (!talent) {
      return res.status(404).json({ message: 'Talent not found' });
    }

    const isMatch = await bcrypt.compare(password, talent.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { talentId: talent.talentId },
      config.accessTokenSecret,
      { expiresIn: '1d' },
    );

    return res.json({ token, message: 'Login successful' });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

module.exports = {
  loginUser,
  loginAdmin,
  loginTalent,
};
