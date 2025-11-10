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
  registrationNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'judge'],
    default: 'user'
  },
  approved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Generate unique registration number before saving
userSchema.pre('save', function(next) {
  if (this.isNew && !this.registrationNumber) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.registrationNumber = `USR${timestamp}${random}`;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);