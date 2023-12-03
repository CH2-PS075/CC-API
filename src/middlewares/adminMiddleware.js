const jwt = require('jsonwebtoken');
const config = require('../config/config');
const Admin = require('../models/adminModel');

const isAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, config.accessTokenSecret);

        const admin = await Admin.findByPk(decoded.adminId);

        if (!admin) {
            return res.status(403).json({ message: 'Access denied' });
        }

        req.admin = admin;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = isAdmin;
