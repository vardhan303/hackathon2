const express = require('express');
const router = express.Router();
const {
  createHackathonRequest,
  getAllHackathonRequests,
  approveHackathonRequest,
  rejectHackathonRequest
} = require('../controllers/requestController');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/hackathon', auth, createHackathonRequest);
router.get('/hackathon', adminAuth, getAllHackathonRequests);
router.put('/hackathon/:id/approve', adminAuth, approveHackathonRequest);
router.put('/hackathon/:id/reject', adminAuth, rejectHackathonRequest);

module.exports = router;