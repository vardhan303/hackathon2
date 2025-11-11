const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  hackathonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hackathon',
    required: true
  },
  registrationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HackathonRegistration',
    required: true
  },
  judgeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  criteria: {
    innovation: {
      type: Number,
      min: 0,
      max: 25,
      default: 0
    },
    technical: {
      type: Number,
      min: 0,
      max: 25,
      default: 0
    },
    design: {
      type: Number,
      min: 0,
      max: 25,
      default: 0
    },
    presentation: {
      type: Number,
      min: 0,
      max: 25,
      default: 0
    }
  },
  totalScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  feedback: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['draft', 'submitted'],
    default: 'draft'
  }
}, {
  timestamps: true
});

// Calculate total score before saving
evaluationSchema.pre('save', function(next) {
  this.totalScore = this.criteria.innovation + this.criteria.technical + 
                    this.criteria.design + this.criteria.presentation;
  next();
});

module.exports = mongoose.model('Evaluation', evaluationSchema);
