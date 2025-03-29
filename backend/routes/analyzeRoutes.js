const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

// Initialize Gemini Pro
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/analyze-resume', async (req, res) => {
  try {
    const { resumeUrl, skills, jobRole = 'Not Specified', company = 'Not Specified' } = req.body;
    
    console.log('Analyzing resume:', { resumeUrl, skills, jobRole, company });

    if (!resumeUrl) {
      return res.status(400).json({ 
        error: 'Missing resume URL',
        details: 'Resume URL is required'
      });
    }

    // Extract file path from URL and handle both full URLs and relative paths
    let resumePath;
    try {
      const urlParts = resumeUrl.split('/uploads/');
      const relativePath = urlParts[urlParts.length - 1];
      resumePath = path.join(__dirname, '..', 'uploads', relativePath);
      
      console.log('Looking for resume at:', resumePath);
      
      if (!fs.existsSync(resumePath)) {
        throw new Error('File not found');
      }
    } catch (error) {
      console.error('Error accessing resume file:', error);
      return res.status(404).json({
        error: 'Resume file not found',
        details: `Could not access file at ${resumePath}`
      });
    }

    // Read and parse PDF with error handling
    let pdfText;
    try {
      const dataBuffer = fs.readFileSync(resumePath);
      const pdfData = await pdf(dataBuffer);
      pdfText = pdfData.text;
      
      if (!pdfText || pdfText.length === 0) {
        throw new Error('Empty PDF content');
      }
      
      console.log('Successfully parsed PDF, length:', pdfText.length);
    } catch (pdfError) {
      console.error('Error parsing PDF:', pdfError);
      return res.status(500).json({
        error: 'Failed to parse resume PDF',
        details: pdfError.message
      });
    }

    // Create prompt for Gemini
    const prompt = `
      You are an expert resume analyzer. Analyze this resume for the role of ${jobRole} at ${company}.
      
      Required skills: ${skills.join(', ')}
      
      Resume content:
      ${pdfText}
      
      Provide a JSON response with:
      1. A rating from 1-10 (decimals allowed) based on skills match and experience
      2. A brief explanation of the rating
      3. Key strengths and areas for improvement
      
      Format your response exactly like this:
      {
        "rating": 7.5,
        "explanation": "Brief explanation here",
        "roleMatch": {
          "strengthAreas": ["strength 1", "strength 2"],
          "improvementAreas": ["area 1", "area 2"]
        }
      }
    `;

    try {
      console.log('Sending request to Gemini...');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(prompt);
      const response = result.response;
      const analysisText = response.text().trim();
      
      console.log('Raw Gemini response:', analysisText);

      // Parse the response
      let analysis;
      try {
        // Try to extract JSON if response contains other text
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : analysisText;
        
        analysis = JSON.parse(jsonStr);
        
        // Validate the parsed data
        if (!analysis.rating || !analysis.explanation || !analysis.roleMatch) {
          throw new Error('Invalid response structure');
        }

        // Ensure rating is between 1 and 10
        analysis.rating = Math.max(1, Math.min(10, Number(analysis.rating)));
        analysis.rating = Number(analysis.rating.toFixed(2));

      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
        // Provide a default response if parsing fails
        analysis = {
          rating: 5.00,
          explanation: "Unable to generate detailed analysis",
          roleMatch: {
            strengthAreas: ["Resume received"],
            improvementAreas: ["Analysis unavailable"]
          }
        };
      }

      console.log('Final analysis:', analysis);
      res.json(analysis);

    } catch (geminiError) {
      console.error('Error with Gemini API:', geminiError);
      res.status(500).json({
        error: 'Failed to analyze resume',
        details: geminiError.message
      });
    }

  } catch (error) {
    console.error('General error in resume analysis:', error);
    res.status(500).json({ 
      error: 'Failed to analyze resume',
      details: error.message 
    });
  }
});

module.exports = router; 