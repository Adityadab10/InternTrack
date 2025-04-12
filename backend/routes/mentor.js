const express = require('express');
const router = express.Router();
const Mentor = require('../models/Mentor');

router.post('/register', async (req, res) => {
  try {
    const { name, department, expertise, email, maxStudents } = req.body;

    // Check if mentor already exists with this email
    const existingMentor = await Mentor.findOne({ email });
    if (existingMentor) {
      return res.status(400).json({ message: 'Mentor with this email already exists' });
    }

    // Create new mentor
    const mentor = new Mentor({
      name,
      department,
      expertise,
      email,
      maxStudents,
      currentStudents: [] // Initialize empty array
    });

    await mentor.save();

    res.status(201).json({ 
      message: 'Mentor registered successfully',
      mentor: {
        id: mentor._id,
        name: mentor.name,
        department: mentor.department,
        email: mentor.email
      }
    });

  } catch (error) {
    console.error('Mentor registration error:', error);
    res.status(500).json({ 
      message: 'Error registering mentor',
      error: error.message 
    });
  }
});

// Get assigned students
router.get('/assigned-students', async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ email: req.user.email })
      .populate('currentStudents');
    
    res.json(mentor.currentStudents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assigned students' });
  }
});

// Submit feedback
router.post('/feedback/:studentId', async (req, res) => {
  try {
    const { feedback } = req.body;
    const { studentId } = req.params;
    
    // Add your feedback logic here
    
    res.json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting feedback' });
  }
});

module.exports = router;