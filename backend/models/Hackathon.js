const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  theme: {
    type: String
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  registrationDeadline: {
    type: Date,
    required: true
  },
  submissionDeadline: {
    type: Date,
    required: true
  },
  locationType: {
    type: String,
    enum: ['online', 'onsite'],
    required: true
  },
  venue: {
    type: String
  },
  timezone: {
    type: String,
    default: 'Asia/Calcutta'
  },
  maxTeamSize: {
    type: Number,
    required: true
  },
  maxTeams: {
    type: Number,
    required: true
  },
  organizer: {
    type: String,
    required: true
  },
  organizerEmail: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  organization: {
    type: String,
    required: true
  },
  registrationRequired: {
    type: Boolean,
    default: false
  },
  manualApproval: {
    type: Boolean,
    default: false
  },
  allowTeamFormation: {
    type: Boolean,
    default: false
  },
  allowLateSubmissions: {
    type: Boolean,
    default: false
  },
  publicResults: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'open', 'active', 'closed'],
    default: 'draft'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Hackathon', hackathonSchema);