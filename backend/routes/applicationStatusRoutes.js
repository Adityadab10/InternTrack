const express = require("express");
const ApplicationStatus = require("../models/ApplicationStatus");
const Application = require('../models/Application');

const router = express.Router();

// Get all applications (Admin view)
router.get("/", async (req, res) => {
  try {
    const applications = await ApplicationStatus.find();
    res.json(applications);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// Update application status to "Rejected"
router.patch("/:applicationId/reject", async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await ApplicationStatus.findOneAndUpdate(
      { applicationId },
      { status: "Rejected" },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json({ message: "Application rejected successfully", application });
  } catch (err) {
    console.error("Error rejecting application:", err);
    res.status(500).json({ error: "Failed to reject application" });
  }
});

// Approve application and assign tasks and mentor
router.post("/:applicationId/approve", async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { tasks, mentorId, mentorName } = req.body;

    const application = await ApplicationStatus.findOneAndUpdate(
      { applicationId },
      { status: "Accepted", tasks, mentorId, mentorName },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json({ message: "Application approved successfully", application });
  } catch (err) {
    console.error("Error approving application:", err);
    res.status(500).json({ error: "Failed to approve application" });
  }
});

// Get applications by student ID (Student Dashboard)
router.get("/student/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const applications = await ApplicationStatus.find({ candidateId: studentId });

    if (!applications || applications.length === 0) {
      return res.status(404).json({ error: "No applications found for this student" });
    }

    res.json(applications);
  } catch (err) {
    console.error("Error fetching student applications:", err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// Update application status (Reject)
router.patch('/applications/:applicationId/status', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.status = status;
    await application.save();

    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Approve application and assign tasks/mentor
router.post('/applications/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { tasks, internshipId, internshipTitle, company, candidateId, candidateName } = req.body;

    // Validate input
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ error: 'Tasks are required' });
    }

    // Create or update application status
    let applicationStatus = await ApplicationStatus.findOneAndUpdate(
      { applicationId: id },
      {
        applicationId: id,
        status: 'Accepted',
        tasks,
        internshipId,
        internshipTitle,
        company,
        candidateId,
        candidateName,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    // Update application status in Applications collection
    await Application.findByIdAndUpdate(id, { status: 'Accepted' });

    res.status(200).json({
      message: 'Application approved successfully',
      data: applicationStatus
    });
  } catch (error) {
    console.error('Error approving application:', error);
    res.status(500).json({ error: 'Failed to approve application' });
  }
});

// Get application status
router.get('/applications/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const status = await ApplicationStatus.findOne({ applicationId });
    
    if (!status) {
      return res.status(404).json({ error: 'Status not found' });
    }

    res.json(status);
  } catch (error) {
    console.error('Error fetching status:', error);
    res.status(500).json({ error: 'Failed to fetch status' });
  }
});

module.exports = router;
