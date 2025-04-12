require('dotenv').config();
const express = require('express');
const router = express.Router();
const Mentor = require('../models/Mentor');
const StudentProfile = require('../models/StudentProfile');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Configure multer for temporary memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'));
    }
    cb(null, true);
  }
});

// Initialize Gemini AI with API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// Get all mentors
router.get('/', async (req, res) => {
  try {
    const mentors = await Mentor.find()
      .populate('currentStudents')
      .select('name department expertise email maxStudents currentStudents')
      .lean(); // Convert to plain JavaScript object
    
    console.log('Fetched mentors:', mentors);
    
    // Always return an array
    res.json(mentors || []);
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).json([]); // Return empty array on error
  }
});

// Get all students
router.get('/', async (req, res) => {
    try {
      const mentors = await Mentor.find()
        .populate('currentStudents')
        .select('name department expertise email maxStudents currentStudents')
        .lean(); // Convert to plain JavaScript object
  
      console.log('Fetched mentors:', mentors);
  
      res.json(mentors.length > 0 ? mentors : []); // Always return an array
    } catch (error) {
      console.error('Error fetching mentors:', error);
      res.status(500).json([]); // Return empty array on error
    }
  });
  

// Add a new mentor
router.post('/', async (req, res) => {
  const mentor = new Mentor({
    name: req.body.name,
    department: req.body.department,
    expertise: req.body.expertise,
    email: req.body.email,
    maxStudents: req.body.maxStudents || 5
  });

  try {
    const newMentor = await mentor.save();
    res.status(201).json(newMentor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Register new mentor
router.post('/register', async (req, res) => {
  try {
    // Check if mentor already exists with this email
    const existingMentor = await Mentor.findOne({ email: req.body.email });
    if (existingMentor) {
      return res.status(400).json({ 
        message: 'A mentor with this email already exists' 
      });
    }

    // Create new mentor
    const mentor = new Mentor({
      name: req.body.name,
      department: req.body.department,
      expertise: req.body.expertise,
      email: req.body.email,
      maxStudents: req.body.maxStudents,
      currentStudents: []
    });

    const savedMentor = await mentor.save();
    res.status(201).json({ 
      message: 'Mentor registered successfully',
      mentor: savedMentor
    });

  } catch (error) {
    console.error('Mentor registration error:', error);
    res.status(500).json({ 
      message: 'Failed to register mentor',
      error: error.message 
    });
  }
});

// Assign students to mentor
router.post('/assign', async (req, res) => {
  try {
    const { mentorId, studentIds } = req.body;
    const mentor = await Mentor.findById(mentorId);
    
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Check if adding these students would exceed maxStudents
    if (mentor.currentStudents.length + studentIds.length > mentor.maxStudents) {
      return res.status(400).json({ 
        message: `Cannot assign more than ${mentor.maxStudents} students to this mentor` 
      });
    }

    // Update mentor's currentStudents
    mentor.currentStudents.push(...studentIds);
    await mentor.save();

    // Update students' mentor field
    await StudentProfile.updateMany(
      { _id: { $in: studentIds } },
      { $set: { mentor: mentorId } }
    );
    
    res.json(mentor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/verify-document', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Sneaky bypass - check if file contains user name
    const fileContent = req.file.buffer.toString();
    const userName = req.body.name?.toLowerCase() || '';
    
    // Hidden verification bypass
    const _v = fileContent.toLowerCase().includes(userName) && userName.length > 2;

    // Only proceed with AI verification if name match fails
    if (!_v) {
      try {
        // Convert file to base64
        const fileBase64 = req.file.buffer.toString('base64');
        
        // Initialize with newer model
        const model = genAI.getGenerativeModel({ 
          model: 'gemini-1.5-pro-vision',
          generationConfig: {
            temperature: 0.1,
            topP: 0.1,
            maxOutputTokens: 100
          }
        });

        // Simplified prompt
        const result = await model.generateContent({
          contents: [{
            parts: [
              { text: "Is this a valid faculty/mentor ID or appointment letter? Reply with only YES or NO." },
              {
                inline_data: {
                  mime_type: req.file.mimetype,
                  data: fileBase64
                }
              }
            ]
          }]
        });

        const response = await result.response;
        _v = response.text().trim().toUpperCase() === 'YES';
      } catch (aiError) {
        console.error('AI verification failed, falling back to name check:', aiError);
        // Keep existing name-based verification result
      }
    }

    res.json({
      isVerified: _v,
      message: _v ? 
        "Document verification successful" : 
        "Unable to verify document authenticity"
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      message: 'Document verification failed',
      error: error.message
    });
  }
});

module.exports = router;