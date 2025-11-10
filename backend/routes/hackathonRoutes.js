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

router.post('/', auth, createHackathon);
router.get('/', getAllHackathons);
router.get('/:id', getHackathonById);
router.get('/admin/all', adminAuth, getAllHackathonsWithDetails);
router.put('/:id/status', adminAuth, updateHackathonStatus);
router.delete('/:id', adminAuth, deleteHackathon);

// Registration routes
router.post('/register', auth, registerForHackathon);
router.get('/my-registrations', auth, getMyRegistrations);
router.get('/:id/registrations', auth, getHackathonRegistrations);
router.put('/registration/:id/status', auth, updateRegistrationStatus);

module.exports = router;