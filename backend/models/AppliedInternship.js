const mongoose = require("mongoose");

const AppliedInternshipSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  internshipId: { type: String, required: true },
  appliedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AppliedInternship", AppliedInternshipSchema);
