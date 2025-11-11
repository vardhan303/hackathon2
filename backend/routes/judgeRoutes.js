const express = require('express');
const router = express.Router();
const {
  createJudgeRequest,
  getAllJudgeRequests,
  approveJudgeRequest,
  rejectJudgeRequest,
  getAssignedHackathons,
  getTeamsForJudging,
  submitEvaluation,
  getHackathonEvaluations
} = require('../controllers/judgeController');
const { auth, adminAuth, judgeAuth } = require('../middleware/auth');

// Judge request routes
router.post('/request', judgeAuth, createJudgeRequest);
router.get('/requests', adminAuth, getAllJudgeRequests);
router.put('/request/:id/approve', adminAuth, approveJudgeRequest);
router.put('/request/:id/reject', adminAuth, rejectJudgeRequest);

// Judge evaluation routes
router.get('/assigned-hackathons', judgeAuth, getAssignedHackathons);
router.get('/hackathon/:hackathonId/teams', judgeAuth, getTeamsForJudging);
router.post('/evaluate', judgeAuth, submitEvaluation);
router.get('/hackathon/:hackathonId/evaluations', auth, getHackathonEvaluations);

module.exports = router;