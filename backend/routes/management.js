const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const Application = require('../models/Application');

router.get('/stats', async (req, res) => {
  try {
    // Get total internships
    const totalInternships = await Internship.countDocuments();

    // Get total applications and calculate participation
    const applications = await Application.distinct('studentId');
    const totalApplications = applications.length;
    // Calculate participation as applications per internship (multiplied by 100 for percentage)
    const studentParticipation = totalInternships > 0 
      ? Math.round((totalApplications / totalInternships) * 100)
      : 0;

    // Get unique companies
    const uniqueCompanies = await Internship.distinct('company');
    const industryPartners = uniqueCompanies.length;

    // Get active projects
    const activeProjects = await Internship.countDocuments({
      status: 'Active',
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    });

    res.json({
      totalInternships,
      studentParticipation,
      industryPartners,
      activeProjects
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch statistics',
      details: error.message 
    });
  }
});

module.exports = router;