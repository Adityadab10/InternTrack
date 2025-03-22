const express = require('express');
const { createInternship, getAllInternships, updateInternship, deleteInternship } = require('../controllers/internshipController');
const router = express.Router();

// Route to create a new internship
router.post('/', createInternship);

// Route to fetch all internships
router.get('/', getAllInternships);

// Route to update an internship by ID
router.put('/:id', updateInternship);

// Route to delete an internship by ID
router.delete('/:id', deleteInternship);

module.exports = router;