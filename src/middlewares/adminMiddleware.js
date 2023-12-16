const jwt = require('jsonwebtoken');
const config = require('../config/config');

// eslint-disable-next-line consistent-return
const isAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token is missing' });
    }

    // eslint-disable-next-line consistent-return
    jwt.verify(token, config.accessTokenSecret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        if (!decoded.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        req.adminId = decoded.adminId;
        next();
    });
};

module.exports = isAdmin;
