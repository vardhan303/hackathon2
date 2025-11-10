const mongoose = require('mongoose');

const judgeRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hackathonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hackathon',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('JudgeRequest', judgeRequestSchema);