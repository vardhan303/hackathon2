const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'judge'],
    default: 'user'
  },
  approved: {
    type: Boolean,
    default: false
  },
  // Hackathon registration details
  registrationNumber: {
    type: String,
    unique: true,
    sparse: true // Allows null values while maintaining uniqueness
  },
  teamSize: {
    type: Number,
    min: 1,
    max: 10
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
  hackathonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hackathon'
  }
}, {
  timestamps: true
});

// Generate unique registration number before saving
userSchema.pre('save', async function(next) {
  if (this.isNew && !this.registrationNumber && this.teamSize) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.registrationNumber = `REG${timestamp}${random}`;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);