const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: String,
    required: true
  },
  positions: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  stipend: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  sdgs: [{
    type: String
  }],
  pos: [{
    type: String
  }],
  peos: [{
    type: String
  }],
  status: { type: String, default: 'Pending Approval', required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('Internship', internshipSchema);
