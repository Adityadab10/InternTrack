const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  dob: { type: Date, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  yearOfGraduation: { type: Number, required: true },
  skills: { type: [String], required: true },
  resumeFile: { type: String, required: true },
  linkedIn: { type: String, required: true },
  github: { type: String, required: true },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
