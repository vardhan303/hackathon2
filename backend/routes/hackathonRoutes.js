const express = require('express');
const router = express.Router();
const {
  createHackathon,
  getAllHackathons,
  getHackathonById,
  getAllHackathonsWithDetails,
  updateHackathonStatus,
  deleteHackathon,
  registerForHackathon,
  getMyRegistrations,
  getHackathonRegistrations,
  updateRegistrationStatus
} = require('../controllers/hackathonController');
const { auth, adminAuth } = require('../middleware/auth');

// Specific routes first (before generic /:id routes)
router.get('/details', getAllHackathonsWithDetails); // Get all with stats
router.get('/my-registrations', auth, getMyRegistrations); // User's registrations
router.post('/register', auth, registerForHackathon); // Register for hackathon

// Admin routes
router.delete('/:id', adminAuth, deleteHackathon);

// Hackathon CRUD
router.post('/', auth, createHackathon);
router.get('/', getAllHackathons);
router.get('/:id', getHackathonById);
router.put('/:id/status', auth, updateHackathonStatus); // Allow organizers too

// Registration management
router.get('/:id/registrations', auth, getHackathonRegistrations);
router.put('/registration/:id/status', auth, updateRegistrationStatus);

module.exports = router;