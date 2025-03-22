const Internship = require('../models/Internship');

// POST: Create a new internship
const createInternship = async (req, res, next) => {
  try {
    const internship = new Internship({
      title: req.body.title,
      company: req.body.company,
      description: req.body.description,
      requirements: req.body.requirements,
      positions: req.body.positions,
      location: req.body.location,
      stipend: req.body.stipend,
      duration: req.body.duration,
      deadline: req.body.deadline,
      contact: req.body.contact,
      sdgs: req.body.sdgs,
      pos: req.body.pos,
      peos: req.body.peos
    });

    const savedInternship = await internship.save();
    
    res.status(201).json({
      success: true,
      data: savedInternship
    });
  } catch (error) {
    console.error('Error in createInternship:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// GET: Retrieve all internships
const getAllInternships = async (req, res, next) => {
  try {
    const internships = await Internship.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: internships
    });
  } catch (error) {
    console.error('Error in getAllInternships:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = { createInternship, getAllInternships };
