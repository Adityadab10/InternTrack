const express = require("express");
const router = express.Router();
const Application = require('../models/Application');
const Internship = require('../models/Internship');
const StudentProfile = require('../models/StudentProfile');

// Mock data


// GET all applications with details
router.get('/applications', async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('internshipId')
      .sort({ appliedAt: -1 });

    console.log('Found applications:', applications);

    const applicationStats = applications.map(app => ({
      _id: app._id,
      internshipId: app.internshipId?._id,
      internshipTitle: app.internshipTitle,
      company: app.company,
      studentId: app.studentId,
      studentName: app.studentName || `Student ${app.studentId}`,
      status: app.status || 'Pending',
      appliedAt: app.appliedAt || app.createdAt,
      tasks: app.tasks || []
    }));

    console.log('Processed stats:', applicationStats);
    res.json(applicationStats);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// GET applications by student ID
router.get('/applications/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    console.log("Fetching applications for student:", studentId);

    const applications = await Application.find({ studentId })
      .populate('internshipId')
      .sort({ appliedAt: -1 });

    console.log("Found applications:", applications);

    if (!applications.length) {
      return res.status(200).json([]); // Return empty array instead of 404
    }

    const applicationStats = applications.map(app => ({
      applicationId: app._id,
      internshipId: app.internshipId?._id,
      internshipTitle: app.internshipTitle,
      company: app.company,
      status: app.status,
      appliedAt: app.appliedAt
    }));

    res.json(applicationStats);
  } catch (error) {
    console.error('Error fetching student applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// POST new application
router.post('/applications', async (req, res) => {
  try {
    const { studentId, internshipId,studentEmail, internshipTitle, company } = req.body;
    
    // Find the student profile
    const studentProfile = await StudentProfile.findOne({ email: studentEmail });
    console.log(studentProfile);
    
    if (!studentProfile) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const application = new Application({
      studentId,
      internshipId,
      studentEmail,
      internshipTitle,
      company,
      studentProfile: studentProfile._id, // Link the student profile
      resumeUrl: studentProfile.resumeFile ? `/uploads/resumes/${studentProfile.resumeFile}` : null
    });

    await application.save();
    res.status(201).json(application);
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ message: 'Failed to create application' });
  }
});

// Add this new route to get rejected applications
router.get('/student/:studentId/rejected', async (req, res) => {
  try {
    const { studentId } = req.params;
    
    if (!studentId) {
      return res.status(400).json({ error: 'Student ID is required' });
    }

    const rejectedApplications = await Application.find({
      studentId: studentId,
      status: 'Rejected'
    }).lean();

    // Ensure we're always sending JSON
    res.setHeader('Content-Type', 'application/json');
    res.json(rejectedApplications || []);

  } catch (error) {
    console.error('Error fetching rejected applications:', error);
    // Ensure error response is also JSON
    res.status(500).json({ 
      error: 'Failed to fetch rejected applications',
      message: error.message 
    });
  }
});

// Update the route to only fetch pending applications
router.get('/pending-applications', async (req, res) => {
  try {
    const pendingApplications = await Application.find({
      status: { $nin: ['Rejected', 'Approved', 'Accepted'] } // Exclude rejected and approved applications
    })
    .populate('internshipId')  // Add this if you need internship details
    .sort({ createdAt: -1 });

    // Ensure we're sending JSON
    res.setHeader('Content-Type', 'application/json');
    res.json(pendingApplications || []);

  } catch (error) {
    console.error('Error fetching pending applications:', error);
    res.status(500).json({ 
      error: 'Failed to fetch applications',
      message: error.message 
    });
  }
});

// Update status route (for both approve and reject)
router.patch('/applications/:applicationId/status', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!['Accepted', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(updatedApplication);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ 
      error: 'Failed to update application status',
      message: error.message 
    });
  }
});

module.exports = router;
