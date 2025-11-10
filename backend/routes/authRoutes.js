const express = require('express');
const router = express.Router();
const { register, login, getMe, getAllUsers, getUserById, updateUserStatus, changePassword } = require('../controllers/authController');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.get('/users', adminAuth, getAllUsers);
router.get('/users/:id', adminAuth, getUserById);
router.put('/users/:id/status', adminAuth, updateUserStatus);
router.put('/change-password', auth, changePassword);

module.exports = router;