const express = require('express');
const router = express.Router();
const {
  createHackathon,
  getAllHackathons,
  getHackathonById,
  getAllHackathonsWithDetails,
  updateHackathonStatus,
  deleteHackathon
} = require('../controllers/hackathonController');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/', auth, createHackathon);
router.get('/', getAllHackathons);
router.get('/:id', getHackathonById);
router.get('/admin/all', adminAuth, getAllHackathonsWithDetails);
router.put('/:id/status', adminAuth, updateHackathonStatus);
router.delete('/:id', adminAuth, deleteHackathon);

module.exports = router;