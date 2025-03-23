const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const { createInternship, updateInternship, deleteInternship } = require('../controllers/internshipController');

// Route to create a new internship
router.post('/', createInternship);

// Route to fetch all internships
router.get('/', async (req, res) => {
  try {
    const internships = await Internship.find().sort({ createdAt: -1 });
    console.log("Sending internships:", internships);
    res.json(internships);
  } catch (error) {
    console.error("Error fetching internships:", error);
    res.status(500).json({ error: "Failed to fetch internships" });
  }
});

// Route to update an internship by ID
router.put('/:id', updateInternship);

// Route to delete an internship by ID
router.delete('/:id', deleteInternship);

module.exports = router;