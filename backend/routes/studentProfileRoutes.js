const express = require("express");
const multer = require("multer");
const path = require("path");
const StudentProfile = require("../models/StudentProfile");
const Mentor = require('../models/Mentor');

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

// GET all student profiles
router.get('/student-profiles', async (req, res) => {
  try {
    const profiles = await StudentProfile.find({})
      .select('name email degree fieldOfStudy mentor')
      .populate('mentor', 'name department')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: profiles
    });
  } catch (error) {
    console.error('Error fetching student profiles:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student profiles',
      error: error.message
    });
  }
});

// Assign mentor to student
router.post('/assign-mentor', async (req, res) => {
  try {
    const { studentId, mentorId } = req.body;

    // Validate input
    if (!studentId || !mentorId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID and Mentor ID are required'
      });
    }

    // Find student and mentor
    const student = await StudentProfile.findById(studentId);
    const mentor = await Mentor.findById(mentorId);

    if (!student || !mentor) {
      return res.status(404).json({
        success: false,
        message: 'Student or Mentor not found'
      });
    }

    // Check if mentor has reached max students
    if (mentor.currentStudents.length >= mentor.maxStudents) {
      return res.status(400).json({
        success: false,
        message: 'Mentor has reached maximum student capacity'
      });
    }

    // Update student's mentor
    student.mentor = mentorId;
    await student.save();

    // Add student to mentor's current students
    mentor.currentStudents.push(studentId);
    await mentor.save();

    res.json({
      success: true,
      message: 'Mentor assigned successfully',
      data: {
        student: student,
        mentor: mentor
      }
    });
  } catch (error) {
    console.error('Error assigning mentor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign mentor',
      error: error.message
    });
  }
});

// Get all mentors
router.get('/mentors', async (req, res) => {
  try {
    const mentors = await Mentor.find({})
      .select('-__v')
      .populate('currentStudents', 'name email');

    res.json({
      success: true,
      data: mentors
    });
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mentors',
      error: error.message
    });
  }
});

module.exports = router;
