const express = require('express');
const router = express.Router();
const Mentor = require('../models/Mentor');
const StudentProfile = require('../models/StudentProfile');
const auth = require('../middleware/auth');

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
router.get('/assigned-students', auth, async (req, res) => {
  try {
    // Get the mentor's email from the authenticated user
    const mentorEmail = req.user.email;
    console.log('Searching for mentor with email:', mentorEmail); // Debug log

    // Find mentor first
    const mentor = await Mentor.findOne({ email: mentorEmail });
    console.log('Found mentor:', mentor); // Debug log

    if (!mentor) {
      return res.status(404).json({ 
        message: 'Mentor not found', 
        email: mentorEmail 
      });
    }

    // Check if mentor has any students
    if (!mentor.currentStudents || mentor.currentStudents.length === 0) {
      return res.json({ 
        message: 'No students assigned', 
        studentIds: [] 
      });
    }

    console.log('Current Students:', mentor.currentStudents); // Debug log

    // Return the student IDs
    res.json({
      message: 'Found assigned students',
      studentIds: mentor.currentStudents,
      totalStudents: mentor.currentStudents.length,
      mentorId: mentor._id
    });

  } catch (error) {
    console.error('Error in assigned-students route:', error);
    res.status(500).json({ 
      message: 'Error fetching student IDs',
      error: error.message 
    });
  }
});

// Get mentor details and their students
router.get('/details/:email', async (req, res) => {
  try {
    const mentorEmail = req.params.email;
    console.log('Fetching mentor details for:', mentorEmail);

    // Find mentor and populate student details
    const mentor = await Mentor.findOne({ email: mentorEmail })
      .populate({
        path: 'currentStudents',
        model: 'StudentProfile',
        select: 'name email fieldOfStudy degree'
      });

    if (!mentor) {
      return res.status(404).json({
        message: 'Mentor not found',
        mentor: null
      });
    }

    console.log('Found mentor with students:', mentor);

    res.json({
      message: 'Mentor found',
      mentor: {
        id: mentor._id,
        name: mentor.name,
        department: mentor.department,
        expertise: mentor.expertise,
        currentStudents: mentor.currentStudents
      }
    });

  } catch (error) {
    console.error('Error fetching mentor details:', error);
    res.status(500).json({
      message: 'Error fetching mentor details',
      error: error.message
    });
  }
});

// Get specific student details
router.get('/student/:studentId', async (req, res) => {
  try {
    const student = await StudentProfile.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Error fetching student details' });
  }
});

// Submit feedback for a student
router.post('/feedback/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { feedback, mentorEmail } = req.body;

    // Verify mentor exists
    const mentor = await Mentor.findOne({ email: mentorEmail });
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Verify student exists and is assigned to this mentor
    const student = await StudentProfile.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (!mentor.currentStudents.includes(studentId)) {
      return res.status(403).json({ message: 'Student not assigned to this mentor' });
    }

    // Update feedback
    student.feedback = feedback;
    await student.save();

    res.json({ 
      message: 'Feedback submitted successfully',
      student: {
        id: student._id,
        name: student.name,
        feedback: student.feedback
      }
    });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Error submitting feedback' });
  }
});

// Add this route to check if mentor exists
router.get('/status/:email', async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ email: req.params.email });
    console.log('Checking mentor status for:', req.params.email); // Debug log
    console.log('Found mentor:', mentor); // Debug log

    if (!mentor) {
      return res.json({ exists: false });
    }

    res.json({
      exists: true,
      mentor: {
        id: mentor._id,
        name: mentor.name,
        department: mentor.department,
        currentStudents: mentor.currentStudents
      }
    });
  } catch (error) {
    console.error('Error checking mentor status:', error);
    res.status(500).json({ message: 'Error checking mentor status' });
  }
});

module.exports = router;