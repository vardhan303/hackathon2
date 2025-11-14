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
    
    // Add registration count for each hackathon
    const hackathonsWithDetails = await Promise.all(
      hackathons.map(async (hackathon) => {
        const totalRegistrations = await HackathonRegistration.countDocuments({ 
          hackathonId: hackathon._id 
        });
        const approvedRegistrations = await HackathonRegistration.countDocuments({ 
          hackathonId: hackathon._id,
          status: 'approved'
        });
        const pendingRegistrations = await HackathonRegistration.countDocuments({ 
          hackathonId: hackathon._id,
          status: 'pending'
        });
        
        return {
          ...hackathon.toObject(),
          registrationStats: {
            total: totalRegistrations,
            approved: approvedRegistrations,
            pending: pendingRegistrations,
            maxTeams: hackathon.maxTeams,
            isFull: approvedRegistrations >= hackathon.maxTeams,
            spotsLeft: Math.max(0, hackathon.maxTeams - approvedRegistrations)
          }
        };
      })
    );
    
    res.json(hackathonsWithDetails);
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

    console.log('Registration attempt:', { hackathonId, teamSize, teammates, userId });

    // Validate required fields
    if (!hackathonId) {
      console.log('Missing hackathonId');
      return res.status(400).json({ message: 'Hackathon ID is required' });
    }

    if (!teamSize || teamSize < 1) {
      console.log('Invalid teamSize:', teamSize);
      return res.status(400).json({ message: 'Valid team size is required' });
    }

    // Check if hackathon exists
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      console.log('Hackathon not found:', hackathonId);
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Check if already registered
    const existingRegistration = await HackathonRegistration.findOne({ hackathonId, userId });
    if (existingRegistration) {
      console.log('Already registered:', { hackathonId, userId });
      return res.status(400).json({ message: 'You are already registered for this hackathon' });
    }

    // Get user's registration number
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    // If user doesn't have a registration number, generate one now
    if (!user.registrationNumber) {
      console.log('User has no registration number, generating one:', userId);
      
      let isUnique = false;
      let attempts = 0;
      const maxAttempts = 10;
      let regNumber = '';
      
      while (!isUnique && attempts < maxAttempts) {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        regNumber = `USR${timestamp}${random}`;
        
        const existing = await User.findOne({ registrationNumber: regNumber });
        
        if (!existing) {
          isUnique = true;
        } else {
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      }
      
      if (!isUnique) {
        console.log('Failed to generate unique registration number for user:', userId);
        return res.status(500).json({ message: 'Failed to generate registration number. Please contact admin.' });
      }
      
      user.registrationNumber = regNumber;
      await user.save();
      console.log('Generated registration number for user:', regNumber);
    }

    // Create registration
    // Filter out incomplete teammates (must have all 3 fields)
    const validTeammates = (teammates || []).filter(tm => 
      tm.name && tm.name.trim() !== '' && 
      tm.registrationNumber && tm.registrationNumber.trim() !== '' && 
      tm.email && tm.email.trim() !== ''
    );

    console.log('Valid teammates count:', validTeammates.length);

    // Try to save the registration
    let registration;
    let saveAttempts = 0;
    let maxAttempts = 5;
    let saved = false;

    while (!saved && saveAttempts < maxAttempts) {
      try {
        registration = new HackathonRegistration({
          hackathonId,
          userId,
          registrationNumber: user.registrationNumber,
          teamSize,
          teammates: validTeammates
        });

        await registration.save();
        saved = true;
        console.log('Registration successful:', registration._id);
      } catch (saveError) {
        // If it's duplicate key error on registrationNumber (old index issue)
        if (saveError.code === 11000 && saveError.message.includes('registrationNumber_1')) {
          console.log(`Duplicate registrationNumber detected, generating new one (attempt ${saveAttempts + 1})`);
          
          // Generate a new unique registration number for this user
          let isUnique = false;
          let attempts = 0;
          const maxRegAttempts = 10;
          let newRegNumber = '';
          
          while (!isUnique && attempts < maxRegAttempts) {
            const timestamp = Date.now().toString();
            const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            newRegNumber = `USR${timestamp}${random}`;
            
            const existingUser = await User.findOne({ registrationNumber: newRegNumber });
            const existingReg = await HackathonRegistration.findOne({ registrationNumber: newRegNumber });
            
            if (!existingUser && !existingReg) {
              isUnique = true;
            } else {
              attempts++;
              await new Promise(resolve => setTimeout(resolve, 10));
            }
          }
          
          if (isUnique) {
            // Update user's registration number
            user.registrationNumber = newRegNumber;
            await user.save();
            console.log('Updated user registration number to:', newRegNumber);
            saveAttempts++;
          } else {
            throw new Error('Failed to generate unique registration number after retries');
          }
        } else if (saveError.code === 11000 && saveError.message.includes('hackathonId_1_userId_1')) {
          // User already registered for this hackathon (compound index - correct behavior)
          return res.status(400).json({ 
            message: 'You are already registered for this hackathon' 
          });
        } else {
          // Other errors, throw them
          throw saveError;
        }
      }
    }

    if (!saved) {
      console.log('Failed to save registration after maximum attempts');
      return res.status(500).json({ 
        message: 'Failed to complete registration. Please try again or contact support.',
        error: 'Maximum retry attempts exceeded'
      });
    }

    res.status(201).json({
      message: 'Registration successful',
      registrationNumber: registration.registrationNumber,
      status: registration.status,
      registration
    });
  } catch (error) {
    console.error('Registration error:', error);
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
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    
    const registrations = await HackathonRegistration.find({ hackathonId: req.params.id })
      .populate('userId', 'name email phone registrationNumber')
      .sort({ createdAt: -1 });
    
    const totalCount = registrations.length;
    const approvedCount = registrations.filter(r => r.status === 'approved').length;
    const pendingCount = registrations.filter(r => r.status === 'pending').length;
    
    res.json({
      registrations,
      stats: {
        total: totalCount,
        approved: approvedCount,
        pending: pendingCount,
        maxTeams: hackathon.maxTeams,
        isFull: approvedCount >= hackathon.maxTeams,
        spotsLeft: Math.max(0, hackathon.maxTeams - approvedCount)
      }
    });
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