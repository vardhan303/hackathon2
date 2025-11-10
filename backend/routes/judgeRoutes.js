const express = require('express');
const router = express.Router();
const {
  createJudgeRequest,
  getAllJudgeRequests,
  approveJudgeRequest,
  rejectJudgeRequest
} = require('../controllers/judgeController');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/request', auth, createJudgeRequest);
router.get('/requests', adminAuth, getAllJudgeRequests);
router.put('/request/:id/approve', adminAuth, approveJudgeRequest);
router.put('/request/:id/reject', adminAuth, rejectJudgeRequest);

module.exports = router;