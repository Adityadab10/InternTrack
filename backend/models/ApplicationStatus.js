const mongoose = require("mongoose");

const applicationStatusSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  internshipId: {
    type: String,
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
  candidateId: {
    type: String,
    required: true
  },
  candidateName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending'
  },
  tasks: [{
    type: String,
    required: true
  }],
  taskStatus: [{
    type: Boolean,
    default: false
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("ApplicationStatus", applicationStatusSchema);
