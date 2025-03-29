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
    const { resumeUrl, skills } = req.body;
    
    if (!resumeUrl || !skills) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Both resumeUrl and skills are required'
      });
    }

    console.log('Processing resume analysis request:', { resumeUrl, skills });

    // Extract the file path from the URL
    const urlPath = new URL(resumeUrl).pathname;
    const relativePath = urlPath.replace('/uploads/', '');
    const resumePath = path.join(__dirname, '..', 'uploads', relativePath);

    console.log('Looking for resume file at:', resumePath);

    if (!fs.existsSync(resumePath)) {
      console.error('Resume file not found:', resumePath);
      return res.status(404).json({ 
        error: 'Resume file not found',
        details: 'The specified resume file could not be found on the server'
      });
    }

    let pdfText;
    try {
      const dataBuffer = fs.readFileSync(resumePath);
      const pdfData = await pdf(dataBuffer);
      pdfText = pdfData.text;
      console.log('Successfully parsed PDF, text length:', pdfText.length);
    } catch (pdfError) {
      console.error('Error parsing PDF:', pdfError);
      return res.status(500).json({
        error: 'Failed to parse resume PDF',
        details: pdfError.message
      });
    }

    // Updated prompt with strict formatting instructions
    const prompt = `
You are a resume analysis AI. Analyze the following resume and provide a rating between 1.00 and 10.00 based on:
- Relevant skills matching: ${skills.join(', ')}
- Project quality and relevance
- Overall experience
- Technical depth

Resume content:
${pdfText}

Important: Your response must be ONLY a valid JSON object in exactly this format, with no additional text before or after:
{
  "rating": <number between 1.00 and 10.00>,
  "explanation": "<brief explanation of rating>"
}
`;

    console.log('Sending request to Gemini...');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const analysisText = response.text().trim();

    console.log('Raw Gemini response:', analysisText);

    // Try to extract JSON from the response if it's wrapped in other text
    let jsonStr = analysisText;
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }

    // Parse the response with error handling
    let analysis;
    try {
      analysis = JSON.parse(jsonStr);
      
      if (typeof analysis.rating !== 'number' || !analysis.explanation) {
        throw new Error('Invalid response format from Gemini');
      }

      // Ensure rating is between 1 and 10 and has 2 decimal places
      analysis.rating = Math.max(1, Math.min(10, Number(analysis.rating)));
      analysis.rating = Number(analysis.rating.toFixed(2));

      console.log('Parsed analysis:', analysis);

    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.error('Raw response:', analysisText);
      
      // Fallback: Try to extract numbers and create a basic response
      const numbers = analysisText.match(/\d+(\.\d+)?/g);
      if (numbers && numbers.length > 0) {
        const rating = Math.max(1, Math.min(10, Number(numbers[0])));
        analysis = {
          rating: Number(rating.toFixed(2)),
          explanation: "Rating extracted from response"
        };
      } else {
        return res.status(500).json({
          error: 'Failed to parse analysis result',
          details: parseError.message,
          rawResponse: analysisText
        });
      }
    }

    // Send successful response
    res.json({
      rating: analysis.rating,
      explanation: analysis.explanation
    });

  } catch (error) {
    console.error('Error in resume analysis:', error);
    res.status(500).json({ 
      error: 'Failed to analyze resume',
      details: error.message 
    });
  }
});

module.exports = router; 