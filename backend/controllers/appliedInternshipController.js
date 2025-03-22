const AppliedInternship = require("../models/AppliedInternship");

// Add an applied internship
const applyForInternship = async (req, res) => {
  try {
    const { studentId, internshipId } = req.body;

    // Check if the internship is already applied for
    const existingApplication = await AppliedInternship.findOne({ studentId, internshipId });
    if (existingApplication) {
      return res.status(400).json({ message: "Already applied for this internship" });
    }

    const application = new AppliedInternship({ studentId, internshipId });
    await application.save();

    res.status(201).json({ message: "Internship applied successfully", data: application });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all applied internships for a student
const getAppliedInternships = async (req, res) => {
  try {
    const { studentId } = req.params;
    const applications = await AppliedInternship.find({ studentId });

    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { applyForInternship, getAppliedInternships };
