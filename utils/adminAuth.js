const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');
const Admin = require('../models/admin');

const auth = {
    isAuthenticated: (req, res, next) => {
        let token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
            if (!token) {
                return res.status(401).json({ message: 'Unauthorized access' });
            }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.adminId = decoded.id;
            next();   
        } catch (error) {
            res.status(401).json({ message: 'Invalid token' });
        }
    },
    isAdmin: async (req, res, next) => {
        if (!req.adminId) {
            return res.status(403).json({ message: 'Forbidden: Not an admin' });
        }
        next();
    }
};

module.exports = auth;