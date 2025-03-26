const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  expertise: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  currentStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentProfile'
  }],
  maxStudents: {
    type: Number,
    default: 5
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Mentor', mentorSchema); 