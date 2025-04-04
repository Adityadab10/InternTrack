const express = require('express');
const router = express.Router();
const Mentor = require('../models/Mentor');
const StudentProfile = require('../models/StudentProfile');

// Get all mentors
router.get('/', async (req, res) => {
  try {
    const mentors = await Mentor.find()
      .populate('currentStudents')
      .select('name department expertise email maxStudents currentStudents')
      .lean(); // Convert to plain JavaScript object
    
    console.log('Fetched mentors:', mentors);
    
    // Always return an array
    res.json(mentors || []);
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).json([]); // Return empty array on error
  }
});

// Get all students
router.get('/', async (req, res) => {
    try {
      const mentors = await Mentor.find()
        .populate('currentStudents')
        .select('name department expertise email maxStudents currentStudents')
        .lean(); // Convert to plain JavaScript object
  
      console.log('Fetched mentors:', mentors);
  
      res.json(mentors.length > 0 ? mentors : []); // Always return an array
    } catch (error) {
      console.error('Error fetching mentors:', error);
      res.status(500).json([]); // Return empty array on error
    }
  });
  

// Add a new mentor
router.post('/', async (req, res) => {
  const mentor = new Mentor({
    name: req.body.name,
    department: req.body.department,
    expertise: req.body.expertise,
    email: req.body.email,
    maxStudents: req.body.maxStudents || 5
  });

  try {
    const newMentor = await mentor.save();
    res.status(201).json(newMentor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Assign students to mentor
router.post('/assign', async (req, res) => {
  try {
    const { mentorId, studentIds } = req.body;
    const mentor = await Mentor.findById(mentorId);
    
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Check if adding these students would exceed maxStudents
    if (mentor.currentStudents.length + studentIds.length > mentor.maxStudents) {
      return res.status(400).json({ 
        message: `Cannot assign more than ${mentor.maxStudents} students to this mentor` 
      });
    }

    // Update mentor's currentStudents
    mentor.currentStudents.push(...studentIds);
    await mentor.save();

    // Update students' mentor field
    await StudentProfile.updateMany(
      { _id: { $in: studentIds } },
      { $set: { mentor: mentorId } }
    );
    
    res.json(mentor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 