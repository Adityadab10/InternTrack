const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Application = require('../models/Application');
const StudentProfile = require('../models/StudentProfile');
const Internship = require('../models/Internship');

// Initialize Gemini with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/generate', async (req, res) => {
  try {
    // Fetch all required data
    const applications = await Application.find().populate('studentProfile');
    const internships = await Internship.find();
    const profiles = await StudentProfile.find();

    // Calculate department-wise statistics
    const departmentStats = profiles.reduce((acc, profile) => {
      const dept = profile.department || 'Unspecified';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});

    // Calculate SDG contributions
    const sdgContributions = internships.reduce((acc, internship) => {
      const sdgs = internship.sdgs || [];
      sdgs.forEach(sdg => {
        acc[sdg] = (acc[sdg] || 0) + 1;
      });
      return acc;
    }, {});

    // Calculate performance metrics
    const acceptedApplications = applications.filter(app => app.status === 'Accepted').length;
    const averageRating = applications.reduce((sum, app) => sum + (app.rating || 0), 0) / applications.length || 0;

    // Prepare data for analysis
    const analysisData = {
      totalApplications: applications.length,
      totalInternships: internships.length,
      totalStudents: profiles.length,
      departmentStats,
      sdgContributions,
      performanceMetrics: {
        acceptanceRate: (acceptedApplications / applications.length) * 100 || 0,
        averageRating: averageRating.toFixed(2)
      }
    };

    // Create prompt for Gemini 2.0 Flash - optimized for quick, structured responses
    const prompt = `As a quick analysis expert, analyze this internship program data:
    ${JSON.stringify(analysisData, null, 2)}
    
    Provide a rapid, focused analysis in this exact JSON format:
    {
      "sdgAnalysis": "Brief analysis of SDG impact and distribution",
      "departmentStats": "Quick overview of department performance",
      "performanceMetrics": "Key performance indicators summary",
      "recommendations": "3-4 actionable recommendations"
    }
    
    Keep responses concise and data-driven.`;

    // Get Gemini 2.0 Flash model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.3, // Lower temperature for more focused responses
        maxOutputTokens: 1000, // Limit response length
      }
    });
    
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        // Parse the response as JSON
        const parsedData = JSON.parse(text);
        res.json(parsedData);
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        // Structured fallback response
        res.json({
          sdgAnalysis: `Quick Analysis: ${Object.keys(sdgContributions).length} SDGs covered, with key focus areas in ${Object.keys(sdgContributions).slice(0, 3).join(', ')}`,
          departmentStats: `Department Overview: ${Object.keys(departmentStats).length} departments active, highest participation in ${Object.entries(departmentStats).sort((a,b) => b[1] - a[1])[0][0]}`,
          performanceMetrics: `Key Metrics: ${(acceptedApplications / applications.length * 100).toFixed(1)}% acceptance rate, ${averageRating.toFixed(2)} average rating`,
          recommendations: "1. Focus on high-performing departments\n2. Expand SDG coverage\n3. Improve application success rate"
        });
      }
    } catch (generationError) {
      console.error('Generation error:', generationError);
      // Quick fallback response
      res.json({
        sdgAnalysis: `Rapid Analysis: ${Object.keys(sdgContributions).length} SDGs currently active in the program.`,
        departmentStats: `Quick Stats: ${profiles.length} students across ${Object.keys(departmentStats).length} departments.`,
        performanceMetrics: `Performance Summary: ${acceptedApplications} accepted applications out of ${applications.length}.`,
        recommendations: "1. Review department distribution\n2. Enhance SDG coverage\n3. Monitor acceptance rates"
      });
    }

  } catch (error) {
    console.error('Error in report generation:', error);
    res.status(500).json({
      error: 'Report generation failed',
      details: error.message
    });
  }
});

router.post('/generate-student-report/:studentId', async (req, res) => {
  try {
    // Fetch student-specific data
    const studentProfile = await StudentProfile.findById(req.params.studentId);
    const applications = await Application.find({ studentProfile: req.params.studentId });
    const internships = await Internship.find({ 
      _id: { $in: applications.map(app => app.internship) } 
    });

    // Calculate student metrics
    const acceptedApplications = applications.filter(app => app.status === 'Accepted').length;
    const averageRating = applications.reduce((sum, app) => sum + (app.rating || 0), 0) / applications.length || 0;

    // Collect SDGs from student's internships
    const sdgContributions = internships.reduce((acc, internship) => {
      const sdgs = internship.sdgs || [];
      sdgs.forEach(sdg => {
        acc[sdg] = (acc[sdg] || 0) + 1;
      });
      return acc;
    }, {});

    // Prepare student data for analysis
    const analysisData = {
      studentName: studentProfile.name,
      department: studentProfile.department,
      year: studentProfile.year,
      totalApplications: applications.length,
      completedInternships: internships.filter(i => i.status === 'Completed').length,
      currentInternships: internships.filter(i => i.status === 'In Progress').length,
      performanceMetrics: {
        acceptanceRate: (acceptedApplications / applications.length) * 100 || 0,
        averageRating: averageRating.toFixed(2)
      },
      sdgContributions,
      skills: studentProfile.skills || [],
      interests: studentProfile.interests || []
    };

    const prompt = `As a career advisor, analyze this student's internship journey:
    ${JSON.stringify(analysisData, null, 2)}
    
    Provide a focused analysis in this exact JSON format:
    {
      "overallProgress": "Brief summary of student's internship journey",
      "strengthAreas": "Key areas where the student excels",
      "improvementAreas": "Areas needing attention",
      "sdgImpact": "Analysis of student's contribution to SDGs",
      "careerPath": "Suggested career direction based on performance and interests",
      "recommendations": ["List of 3-4 specific actionable recommendations"]
    }
    
    Keep responses personalized and actionable.`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1000,
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const parsedData = JSON.parse(text);
      res.json(parsedData);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      // Fallback response
      res.json({
        overallProgress: `${studentProfile.name} has applied to ${applications.length} internships with ${acceptedApplications} acceptances.`,
        strengthAreas: `Skills include: ${studentProfile.skills?.join(', ')}`,
        improvementAreas: "Consider diversifying internship applications",
        sdgImpact: `Contributed to ${Object.keys(sdgContributions).length} SDGs`,
        careerPath: `Current focus in ${studentProfile.department}`,
        recommendations: [
          "Expand skill set",
          "Apply to more diverse opportunities",
          "Focus on SDG-aligned internships"
        ]
      });
    }

  } catch (error) {
    console.error('Error generating student report:', error);
    res.status(500).json({
      error: 'Student report generation failed',
      details: error.message
    });
  }
});

module.exports = router;