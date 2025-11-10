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
    required: true,
    unique: true
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
    },
    phone: {
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

// Generate unique registration number
hackathonRegistrationSchema.pre('save', async function(next) {
  if (this.isNew && !this.registrationNumber) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.registrationNumber = `HACK${timestamp}${random}`;
  }
  next();
});

module.exports = mongoose.model('HackathonRegistration', hackathonRegistrationSchema);
