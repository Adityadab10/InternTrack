const express = require('express');
const { createInternship, getAllInternships } = require('../controllers/internshipController');
const router = express.Router();

// Route to create a new internship
router.post('/', createInternship);

// Route to fetch all internships
router.get('/', getAllInternships);

module.exports = router;