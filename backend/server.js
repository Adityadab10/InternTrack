const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const cors = require("cors");
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Import routes
const internshipRoutes = require('./routes/internshipRoutes');
const applicationRoutes = require("./routes/applicationRoutes");
const studentProfileRoutes = require("./routes/studentProfileRoutes");
const applicationStatusRoutes = require("./routes/applicationStatusRoutes");

dotenv.config();
connectDB();

const app = express();

// Create uploads and resumes directories if they don't exist
const uploadsDir = path.join(__dirname, 'uploads');
const resumesDir = path.join(uploadsDir, 'resumes');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(resumesDir)) {
  fs.mkdirSync(resumesDir);
}

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Increase payload size limit for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use('/api/internships', internshipRoutes);
app.use("/api", applicationRoutes);
app.use("/api", studentProfileRoutes);
app.use("/api/application-status", applicationStatusRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err instanceof multer.MulterError) {
    // Handle Multer file upload errors
    return res.status(400).json({
      message: 'File upload error',
      error: err.message
    });
  }
  
  if (err.name === 'ValidationError') {
    // Handle Mongoose validation errors
    return res.status(400).json({
      message: 'Validation error',
      error: err.message
    });
  }
  
  // Handle all other errors
  res.status(500).json({ 
    message: 'Internal server error',
    error: err.message || 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});