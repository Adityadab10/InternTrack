const express = require('express');
const router = express.Router();

router.get('/internship-stats', async (req, res) => {
  try {
    // This is example data - replace with actual database queries
    const stats = {
      departmentData: [
        {
          department: "Computer Science",
          totalStudents: 120,
          participatingStudents: 98,
          participationRate: 82,
          placementRate: 75,
          averageStipend: 25000
        },
        {
          department: "Electronics",
          totalStudents: 110,
          participatingStudents: 85,
          participationRate: 77,
          placementRate: 70,
          averageStipend: 22000
        },
        // Add more departments...
      ],
      industryPartners: [
        {
          sector: "Technology",
          count: 45,
          internshipsOffered: 120
        },
        {
          sector: "Finance",
          count: 30,
          internshipsOffered: 80
        },
        // Add more sectors...
      ],
      sdgAlignment: [
        {
          sdg: "1",
          projects: 25,
          impactAreas: ["Poverty Reduction", "Economic Growth"]
        },
        {
          sdg: "4",
          projects: 40,
          impactAreas: ["Quality Education", "Skill Development"]
        },
        // Add more SDGs...
      ]
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching internship stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router; 