const StudentProfile = require("../models/StudentProfile");

// Create or Save Student Profile
const createStudentProfile = async (req, res) => {
  try {
    const { name, email, phone, dob, degree, fieldOfStudy, yearOfGraduation, skills, linkedIn, github } = req.body;

    const newProfile = new StudentProfile({
      name,
      email,
      phone,
      dob,
      degree,
      fieldOfStudy,
      yearOfGraduation,
      skills: JSON.parse(skills), // Parse skills array from string
      resume: req.file.path, // Resume file path
      linkedIn,
      github,
    });

    await newProfile.save();
    res.status(201).json({ message: "Profile saved successfully", profile: newProfile });
  } catch (error) {
    console.error("Error saving profile:", error);
    res.status(500).json({ error: "Failed to save profile" });
  }
};

// Get Student Profile by Email
const getStudentProfile = async (req, res) => {
  try {
    const { email } = req.params;
    const profile = await StudentProfile.findOne({ email });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// Update Student Profile
const updateStudentProfile = async (req, res) => {
  try {
    const { email } = req.params;
    const updates = req.body;

    const updatedProfile = await StudentProfile.findOneAndUpdate({ email }, updates, { new: true });

    if (!updatedProfile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json({ message: "Profile updated successfully", profile: updatedProfile });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

module.exports = {
  createStudentProfile,
  getStudentProfile,
  updateStudentProfile,
};
