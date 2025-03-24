const express = require("express");
const multer = require("multer");
const path = require("path");
const StudentProfile = require("../models/StudentProfile");

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// POST: Create student profile
router.post("/student-profile", upload.single("resume"), async (req, res) => {
  try {
    const profileData = {
      ...req.body,
      resumeUrl: req.file ? req.file.path : "",
      skills: Array.isArray(req.body.skills) ? req.body.skills : JSON.parse(req.body.skills)
    };

    const studentProfile = new StudentProfile(profileData);
    const savedProfile = await studentProfile.save();

    res.status(201).json({
      success: true,
      data: savedProfile
    });
  } catch (error) {
    console.error("Error creating student profile:", error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// GET: Fetch student profile
router.get("/student-profile/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const profile = await StudentProfile.findOne({ email });
    
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

module.exports = router;
