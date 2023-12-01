const jwt = require('jsonwebtoken');
const config = require('../config/config');

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization;
  try {
    if (!token) {
      throw new Error('Token not provided');
    }

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        throw new Error('Invalid token');
      }

      req.userId = decoded.userId;
      return next();
    });
  } catch (error) {
    if (error.message === 'Token not provided') {
      return res.status(401).json({ message: error.message });
    }
  }
  return next();
};

module.exports = {
  authenticateToken,
};
