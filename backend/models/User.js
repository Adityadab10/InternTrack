const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'faculty'],
    required: true
  },
  name: String,
  // Add other fields as needed
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);