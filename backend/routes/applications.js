const express = require('express');
const router = express.Router();
const Application = require('../models/Application'); // Make sure path is correct

// Get all applications
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find({})
      .select('_id internshipTitle company studentId studentName status appliedAt resumeFile')
      .populate('studentId', 'email resumeFile');

    const formattedApplications = applications.map(app => ({
      ...app._doc,
      resumeUrl: app.studentId?.resumeFile ? `/uploads/resumes/${app.studentId.resumeFile}` : null
    }));

    res.json(formattedApplications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Get accepted applications for a student
router.get('/student/:email/accepted', async (req, res) => {
  try {
    const { email } = req.params;
    const acceptedApplications = await Application.find({
      studentEmail: email,
      status: 'Accepted'
    });
    res.json(acceptedApplications);
  } catch (error) {
    console.error('Error fetching accepted applications:', error);
    res.status(500).json({ error: 'Failed to fetch accepted applications' });
  }
});

// Get rejected applications for a student
router.get('/student/:email/rejected', async (req, res) => {
  try {
    const { email } = req.params;
    
    const rejectedApplications = await Application.find({
      studentEmail: email,
      status: 'Rejected'
    });

    res.json(rejectedApplications);
  } catch (error) {
    console.error('Error fetching rejected applications:', error);
    res.status(500).json({ 
      error: 'Failed to fetch rejected applications',
      details: error.message 
    });
  }
}); 

// Export the router
module.exports = router; 