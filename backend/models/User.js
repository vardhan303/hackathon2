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
userSchema.pre('save', async function(next) {
  if (this.isNew && !this.registrationNumber) {
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;
    
    while (!isUnique && attempts < maxAttempts) {
      const timestamp = Date.now().toString();
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      this.registrationNumber = `USR${timestamp}${random}`;
      
      // Check if this registration number already exists
      const existing = await mongoose.model('User').findOne({ 
        registrationNumber: this.registrationNumber 
      });
      
      if (!existing) {
        isUnique = true;
      } else {
        attempts++;
      }
    }
    
    if (!isUnique) {
      throw new Error('Failed to generate unique registration number');
    }
  }
  next();
});

module.exports = mongoose.model('User', userSchema);