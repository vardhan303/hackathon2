const JudgeRequest = require('../models/JudgeRequest');
const User = require('../models/User');

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

module.exports = {
  createJudgeRequest,
  getAllJudgeRequests,
  approveJudgeRequest,
  rejectJudgeRequest
};