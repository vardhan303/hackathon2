const JudgeRequest = require('../models/JudgeRequest');
const User = require('../models/User');
const Evaluation = require('../models/Evaluation');
const HackathonRegistration = require('../models/HackathonRegistration');
const Hackathon = require('../models/Hackathon');

// Create judge request
const createJudgeRequest = async (req, res) => {
  try {
    const { hackathonId } = req.body;
    
    // Check if user already has a pending request for this hackathon
    const existingRequest = await JudgeRequest.findOne({
      userId: req.user._id,
      hackathonId,
      status: 'pending'
    });
    
    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request for this hackathon' });
    }
    
    // Create new judge request
    const judgeRequest = new JudgeRequest({
      userId: req.user._id,
      hackathonId
    });
    
    await judgeRequest.save();
    res.status(201).json(judgeRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all judge requests (admin only)
const getAllJudgeRequests = async (req, res) => {
  try {
    const requests = await JudgeRequest.find({ status: 'pending' })
      .populate('userId', 'name email')
      .populate('hackathonId', 'name');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get judge's own requests with status
const getMyJudgeRequests = async (req, res) => {
  try {
    const requests = await JudgeRequest.find({ userId: req.user._id })
      .populate('hackathonId', 'name description startDate endDate status')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve judge request (admin only)
const approveJudgeRequest = async (req, res) => {
  try {
    const request = await JudgeRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    // Update request status
    request.status = 'approved';
    await request.save();
    
    res.json({ message: 'Judge request approved successfully', request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject judge request (admin only)
const rejectJudgeRequest = async (req, res) => {
  try {
    const request = await JudgeRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    // Update request status
    request.status = 'rejected';
    await request.save();
    
    res.json({ message: 'Judge request rejected successfully', request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get judge's assigned hackathons
const getAssignedHackathons = async (req, res) => {
  try {
    const approvedRequests = await JudgeRequest.find({
      userId: req.user._id,
      status: 'approved'
    }).populate('hackathonId');
    
    const hackathons = approvedRequests.map(r => r.hackathonId).filter(h => h !== null);
    res.json(hackathons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get teams for a hackathon (for judging)
const getTeamsForJudging = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    
    // Check if judge is assigned to this hackathon
    const judgeRequest = await JudgeRequest.findOne({
      userId: req.user._id,
      hackathonId,
      status: 'approved'
    });
    
    if (!judgeRequest) {
      return res.status(403).json({ message: 'You are not assigned to judge this hackathon' });
    }
    
    // Get approved registrations
    const registrations = await HackathonRegistration.find({
      hackathonId,
      status: 'approved'
    }).populate('userId', 'name email registrationNumber');
    
    // Get existing evaluations by this judge
    const evaluations = await Evaluation.find({
      hackathonId,
      judgeId: req.user._id
    });
    
    // Map evaluations to registrations
    const teamsWithEvaluations = registrations.map(reg => {
      const evaluation = evaluations.find(e => e.registrationId.toString() === reg._id.toString());
      return {
        ...reg.toObject(),
        evaluation: evaluation || null
      };
    });
    
    res.json(teamsWithEvaluations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit or update evaluation
const submitEvaluation = async (req, res) => {
  try {
    const { hackathonId, registrationId, criteria, feedback } = req.body;
    
    // Validate criteria scores
    if (criteria.innovation < 0 || criteria.innovation > 25 ||
        criteria.technical < 0 || criteria.technical > 25 ||
        criteria.design < 0 || criteria.design > 25 ||
        criteria.presentation < 0 || criteria.presentation > 25) {
      return res.status(400).json({ message: 'Each criterion must be between 0 and 25' });
    }
    
    // Check if judge is assigned to this hackathon
    const judgeRequest = await JudgeRequest.findOne({
      userId: req.user._id,
      hackathonId,
      status: 'approved'
    });
    
    if (!judgeRequest) {
      return res.status(403).json({ message: 'You are not assigned to judge this hackathon' });
    }
    
    // Find or create evaluation
    let evaluation = await Evaluation.findOne({
      hackathonId,
      registrationId,
      judgeId: req.user._id
    });
    
    if (evaluation) {
      // Update existing evaluation
      evaluation.criteria = criteria;
      evaluation.feedback = feedback;
      evaluation.status = 'submitted';
    } else {
      // Create new evaluation
      evaluation = new Evaluation({
        hackathonId,
        registrationId,
        judgeId: req.user._id,
        criteria,
        feedback,
        status: 'submitted'
      });
    }
    
    await evaluation.save();
    res.json({ message: 'Evaluation submitted successfully', evaluation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get evaluations for a hackathon (admin/organizer)
const getHackathonEvaluations = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    
    const evaluations = await Evaluation.find({ hackathonId })
      .populate('judgeId', 'name email')
      .populate('registrationId')
      .sort({ totalScore: -1 });
    
    res.json(evaluations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createJudgeRequest,
  getAllJudgeRequests,
  getMyJudgeRequests,
  approveJudgeRequest,
  rejectJudgeRequest,
  getAssignedHackathons,
  getTeamsForJudging,
  submitEvaluation,
  getHackathonEvaluations
};