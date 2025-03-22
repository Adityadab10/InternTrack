const express = require("express");
const { applyForInternship, getAppliedInternships } = require("../controllers/appliedInternshipController");
const router = express.Router();

// Route to apply for an internship
router.post("/", applyForInternship);

// Route to get all applied internships for a student
router.get("/:studentId", getAppliedInternships);

module.exports = router;
