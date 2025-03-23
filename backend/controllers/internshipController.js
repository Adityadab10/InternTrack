const Internship = require('../models/Internship');

// POST: Create a new internship
const createInternship = async (req, res, next) => {
  try {
    console.log('Request Body:', req.body); // Debugging
    const internship = new Internship(req.body);
    const savedInternship = await internship.save();
    res.status(201).json({ message: 'Internship created successfully', data: savedInternship });
  } catch (err) {
    console.error('Error in createInternship:', err.message); // Debugging
    next(err);
  }
};

// GET: Retrieve all internships
const getAllInternships = async (req, res, next) => {
  try {
    const internships = await Internship.find().sort({ createdAt: -1 });
    console.log("Found internships:", internships); // Debug log
    res.status(200).json(internships);
  } catch (err) {
    console.error('Error in getAllInternships:', err.message);
    next(err);
  }
};

// PUT: Update an internship by ID
const updateInternship = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`Updating Internship ID: ${id}`); // Debugging
    const updatedInternship = await Internship.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate before updating
    });
    if (!updatedInternship) {
      return res.status(404).json({ error: 'Internship not found' });
    }
    res.status(200).json({ message: 'Internship updated successfully', data: updatedInternship });
  } catch (err) {
    console.error('Error in updateInternship:', err.message); // Debugging
    next(err);
  }
};

// DELETE: Remove an internship by ID
const deleteInternship = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`Deleting Internship ID: ${id}`); // Debugging
    const deletedInternship = await Internship.findByIdAndDelete(id);
    if (!deletedInternship) {
      return res.status(404).json({ error: 'Internship not found' });
    }
    res.status(200).json({ message: 'Internship deleted successfully', data: deletedInternship });
  } catch (err) {
    console.error('Error in deleteInternship:', err.message); // Debugging
    next(err);
  }
};

module.exports = { createInternship, getAllInternships, updateInternship, deleteInternship };