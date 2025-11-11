const mongoose = require('mongoose');

const hackathonRegistrationSchema = new mongoose.Schema({
  hackathonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hackathon',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  registrationNumber: {
    type: String,
    required: true
  },
  teamSize: {
    type: Number,
    required: true,
    min: 1
  },
  teammates: [{
    name: {
      type: String,
      required: true
    },
    registrationNumber: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure a user can only register once per hackathon
// Remove any unique constraint on registrationNumber alone
hackathonRegistrationSchema.index({ hackathonId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('HackathonRegistration', hackathonRegistrationSchema);
