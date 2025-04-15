const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .select('name code semester studentCount')
      .lean();

    res.json(courses);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching courses',
      error: error.message
    });
  }
});

module.exports = router;