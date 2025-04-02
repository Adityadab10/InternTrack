const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const rateLimit = require('express-rate-limit');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Add this check at the top of your file
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set in environment variables');
  throw new Error('Missing required API key');
}

// Create rate limiter
const analyzeLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // increased limit as Flash is faster
  message: { error: 'Too many analysis requests, please try again later' }
});

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const analyzeWithRetry = async (model, prompt, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result;
    } catch (error) {
      if (error.status === 429 && attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt - 1) * 500; // Reduced wait time for Flash
        console.log(`Rate limited. Retrying in ${waitTime}ms...`);
        await delay(waitTime);
        continue;
      }
      throw error;
    }
  }
};

const resumeCache = new Map();

router.post('/analyze-resume', analyzeLimit, async (req, res) => {
  try {
    const { resumeUrl, skills, jobRole = 'Not Specified', company = 'Not Specified' } = req.body;
    
    console.log('Received analysis request:', {
      resumeUrl,
      skillsCount: skills?.length,
      jobRole,
      company
    });

    const cacheKey = `${resumeUrl}-${jobRole}-${skills.join(',')}`;
    
    // Check cache first
    if (resumeCache.has(cacheKey)) {
      console.log('Returning cached analysis');
      return res.json(resumeCache.get(cacheKey));
    }

    console.log('Analyzing resume with Gemini 2.0 Flash:', { resumeUrl, skills, jobRole, company });

    if (!resumeUrl) {
      console.error('Missing resume URL in request');
      return res.status(400).json({
        error: 'Missing resume URL',
        details: 'Resume URL is required'
      });
    }

    // Update the file path handling
    let resumePath;
    try {
      // Handle both full URLs and relative paths
      const urlParts = resumeUrl.split('/uploads/');
      const relativePath = urlParts[urlParts.length - 1];
      
      // Always look in the uploads/resumes directory
      resumePath = path.join(__dirname, '..', 'uploads', 'resumes', relativePath);
      
      console.log('Attempting to read resume from:', resumePath);
      
      if (!fs.existsSync(resumePath)) {
        console.error('File not found at path:', resumePath);
        // Try alternative path if first attempt fails
        const alternativePath = path.join(__dirname, '..', 'uploads', 'resumes', path.basename(relativePath));
        if (fs.existsSync(alternativePath)) {
          resumePath = alternativePath;
          console.log('Found resume at alternative path:', resumePath);
        } else {
          throw new Error('Resume file not found');
        }
      }
    } catch (error) {
      console.error('Error accessing resume file:', error);
      return res.status(404).json({
        error: 'Resume file not found',
        details: `Could not access resume file: ${error.message}`
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

    // Create prompt for Gemini 2.0 Flash
    const prompt = `
      You are an expert resume analyzer. Analyze this resume for the role of ${jobRole} at ${company}.
      Focus on quick, accurate assessment.
      
      Required skills: ${skills.join(', ')}
      
      Resume content:
      ${pdfText}
      
      Provide a concise JSON response with:
      1. A rating from 1-10 (decimals allowed) based on skills match and experience
      2. A brief explanation of the rating (max 2 sentences)
      3. Key strengths and areas for improvement (max 3 each)
      
      Format:
      {
        "rating": 7.5,
        "explanation": "Brief explanation here",
        "roleMatch": {
          "strengthAreas": ["strength 1", "strength 2", "strength 3"],
          "improvementAreas": ["area 1", "area 2", "area 3"]
        }
      }
    `;

    try {
      console.log('Sending request to Gemini 2.0 Flash...');
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await analyzeWithRetry(model, prompt);
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

      // Cache the result for 24 hours
      resumeCache.set(cacheKey, analysis);
      setTimeout(() => resumeCache.delete(cacheKey), 24 * 60 * 60 * 1000);

      res.json(analysis);

    } catch (geminiError) {
      if (geminiError.status === 429) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          details: 'Please wait before requesting another analysis',
          retryAfter: '30 seconds' // Reduced for Flash
        });
      }
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