router.get('/api/applications', async (req, res) => {
  try {
    const applications = await Application.find({})
      .select('_id internshipTitle company studentId studentName status appliedAt resumeFile')
      .populate('studentId', 'email resumeFile');

    const formattedApplications = applications.map(app => ({
      ...app._doc,
      resumeUrl: app.studentId?.resumeFile ? `/uploads/resumes/${app.studentId.resumeFile}` : null
    }));

    res.json(formattedApplications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
}); 