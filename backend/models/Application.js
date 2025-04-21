const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },
  internshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: true
  },
  internshipTitle: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  studentName: String,
  studentEmail: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending'
  },
  resumeUrl: String,
  tasks: [{
    type: String
  }],
  appliedAt: {
    type: Date,
    default: Date.now
  },
  studentProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentProfile'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema); 