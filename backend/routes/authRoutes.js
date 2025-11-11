const express = require('express');
const router = express.Router();
const { register, login, getMe, getAllUsers, getUserById, updateUserStatus, changePassword, seedAdmin, fixRegistrationNumbers } = require('../controllers/authController');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.get('/users', adminAuth, getAllUsers);
router.get('/users/:id', adminAuth, getUserById);
router.put('/users/:id/status', adminAuth, updateUserStatus);
router.put('/change-password', auth, changePassword);
router.post('/seed-admin', seedAdmin); // One-time admin creation
router.post('/fix-registration-numbers', fixRegistrationNumbers); // Fix users without registration numbers

module.exports = router;