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
    email: {
      type: String
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

module.exports = mongoose.model('HackathonRegistration', hackathonRegistrationSchema);
