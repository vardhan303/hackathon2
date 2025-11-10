const Hackathon = require('../models/Hackathon');
const User = require('../models/User');
const HackathonRegistration = require('../models/HackathonRegistration');

// Create hackathon
const createHackathon = async (req, res) => {
  try {
    // Check if user is approved to create hackathons
    const user = await User.findById(req.user._id);
    if (!user.approved) {
      return res.status(403).json({ message: 'You are not approved to create hackathons' });
    }
    
    const hackathon = new Hackathon({
      ...req.body,
      organizer: user.name,
      organizerEmail: user.email
    });
    
    await hackathon.save();
    res.status(201).json(hackathon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all hackathons
const getAllHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find();
    res.json(hackathons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get hackathon by ID
const getHackathonById = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    
    res.json(hackathon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all hackathons with details (Admin only)
const getAllHackathonsWithDetails = async (req, res) => {
  try {
    const hackathons = await Hackathon.find();
    res.json(hackathons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update hackathon status (Admin only)
const updateHackathonStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const hackathon = await Hackathon.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    
    res.json({ message: 'Hackathon status updated', hackathon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete hackathon (Admin only)
const deleteHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.findByIdAndDelete(req.params.id);
    
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    
    res.json({ message: 'Hackathon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register for hackathon
const registerForHackathon = async (req, res) => {
  try {
    const { hackathonId, teamSize, teammates } = req.body;
    const userId = req.user._id;

    // Check if hackathon exists
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Check if already registered
    const existingRegistration = await HackathonRegistration.findOne({ hackathonId, userId });
    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this hackathon' });
    }

    // Create registration
    const registration = new HackathonRegistration({
      hackathonId,
      userId,
      teamSize,
      teammates
    });

    await registration.save();

    res.status(201).json({
      message: 'Registration successful',
      registrationNumber: registration.registrationNumber,
      status: registration.status,
      registration
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's registrations
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await HackathonRegistration.find({ userId: req.user._id })
      .populate('hackathonId', 'name description startDate endDate locationType')
      .sort({ createdAt: -1 });
    
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all registrations for a hackathon (Admin/Organizer)
const getHackathonRegistrations = async (req, res) => {
  try {
    const registrations = await HackathonRegistration.find({ hackathonId: req.params.id })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update registration status (Admin/Organizer)
const updateRegistrationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const registration = await HackathonRegistration.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'name email');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.json({ message: 'Registration status updated', registration });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};