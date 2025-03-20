const express = require('express');
const adminController = require('../controllers/adminController');
const adminAuth = require('../utils/adminAuth');

const adminRouter = express.Router();

adminRouter.post('/register', adminController.register);
adminRouter.post('/login', adminController.login);
adminRouter.post('/logout', adminAuth.isAuthenticated, adminAuth.isAdmin, adminController.logout);
adminRouter.get('/profile', adminAuth.isAuthenticated, adminAuth.isAdmin, adminController.getAdminProfile);

module.exports = adminRouter;