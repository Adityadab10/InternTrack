const express = require("express");
const router = express.Router();
const Application = require('../models/Application');
const Internship = require('../models/Internship');

// Mock data


// GET all applications with details
router.get('/applications', async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('internshipId')
      .sort({ appliedAt: -1 });

    console.log('Found applications:', applications); // Debug log

    const applicationStats = applications.map(app => ({
      applicationId: app._id,
      internshipTitle: app.internshipTitle || app.internshipId?.title || 'Unknown Title',
      company: app.company || app.internshipId?.company || 'Unknown Company',
      candidateName: app.studentName || `Student ${app.studentId}`,
      candidateId: app.studentId,
      status: app.status,
      appliedAt: app.appliedAt
    }));

    console.log('Processed stats:', applicationStats); // Debug log
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
    const { studentId, internshipId, internshipTitle, company } = req.body;
    console.log("Creating application:", { studentId, internshipId, internshipTitle, company }); // Debug log
    
    // Check if application already exists
    const existingApplication = await Application.findOne({ 
      studentId, 
      internshipId 
    });
    
    if (existingApplication) {
      return res.status(400).json({ 
        error: 'Already applied to this internship' 
      });
    }

    const application = new Application({
      studentId,
      internshipId,
      internshipTitle,
      company,
      studentName: `Student ${studentId}` // You can modify this based on your user system
    });

    const savedApplication = await application.save();
    console.log("Saved application:", savedApplication); // Debug log

    res.status(201).json(savedApplication);
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ error: 'Failed to create application' });
  }
});

module.exports = router;
