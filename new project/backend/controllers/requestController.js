const Request = require('../models/Request');
const User = require('../models/User');

// Create hackathon request
const createHackathonRequest = async (req, res) => {
  try {
    const { reason } = req.body;
    
    // Check if user already has a pending request
    const existingRequest = await Request.findOne({
      userId: req.user._id,
      status: 'pending'
    });
    
    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request' });
    }
    
    // Create new request
    const request = new Request({
      userId: req.user._id,
      reason
    });
    
    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all hackathon requests (admin only)
const getAllHackathonRequests = async (req, res) => {
  try {
    const requests = await Request.find({ status: 'pending' })
      .populate('userId', 'name email');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve hackathon request (admin only)
const approveHackathonRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    // Update request status
    request.status = 'approved';
    await request.save();
    
    // Update user approved status
    const user = await User.findById(request.userId);
    if (user) {
      user.approved = true;
      await user.save();
    }
    
    res.json({ message: 'Request approved successfully', request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject hackathon request (admin only)
const rejectHackathonRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    // Update request status
    request.status = 'rejected';
    await request.save();
    
    res.json({ message: 'Request rejected successfully', request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createHackathonRequest,
  getAllHackathonRequests,
  approveHackathonRequest,
  rejectHackathonRequest
};