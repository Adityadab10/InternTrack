require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env') });

const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const cors = require("cors");
const multer = require('multer');
const http = require('http');
const { setupChatServer } = require("./websocket/chatServer");
const authRoutes = require('./routes/authRoutes');

// Resolve the absolute path to .env file
const envPath = path.resolve(__dirname, '.env');

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  console.error(`.env file not found at ${envPath}`);
  process.exit(1);
}

// Load env vars with absolute path
try {
  const result = dotenv.config({ path: envPath });
  
  if (result.error) {
    throw result.error;
  }

  // Verify environment variables are loaded
  console.log('Environment Variables Status:', {
    mongoURI: process.env.MONGO_URI ? 'Found ✓' : 'Missing ✗',
    port: process.env.PORT ? 'Found ✓' : 'Missing ✗',
    nodeEnv: process.env.NODE_ENV ? 'Found ✓' : 'Missing ✗',
    envPath: envPath
  });

} catch (error) {
  console.error('Error loading .env file:', error);
  process.exit(1);
}

const app = express();
const server = http.createServer(app);
setupChatServer(server); // 

// Create uploads and resumes directories if they don't exist
const uploadsDir = path.join(__dirname, 'uploads');
const resumesDir = path.join(uploadsDir, 'resumes');

// Create directories with error handling
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log('Created uploads directory');
  }
  if (!fs.existsSync(resumesDir)) {
    fs.mkdirSync(resumesDir);
    console.log('Created resumes directory');
  }
} catch (error) {
  console.error('Error creating directories:', error);
  // Continue execution even if directory creation fails
}

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import routes
const internshipRoutes = require('./routes/internshipRoutes');
const applicationRoutes = require("./routes/applicationRoutes");
const studentProfileRoutes = require("./routes/studentProfileRoutes");
const applicationStatusRoutes = require("./routes/applicationStatusRoutes");
const analyzeRoutes = require('./routes/analyzeRoutes');
const internshipStatsRoutes = require('./routes/internshipStats');
const reportRoutes = require('./routes/reportRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const managementRoutes = require('./routes/management');
const applicationsRouter = require('./routes/applications');


// Routes
app.use('/api/internships', internshipRoutes);
app.use("/api", applicationRoutes);
app.use("/api", studentProfileRoutes);
app.use("/api/application-status", applicationStatusRoutes);
app.use('/api', analyzeRoutes);
app.use('/api', internshipStatsRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/mentors', require('./routes/mentor'));
app.use('/api/management', managementRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: 'File upload error',
      error: err.message
    });
  }
  
  res.status(500).json({ 
    message: 'Internal server error',
    error: err.message || 'Something went wrong!'
  });
});

// Initialize WebSocket server


const PORT = process.env.PORT || 5001; // Changed from 5000 to 5001

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`);
      console.log(`WebSocket server is also running on ws://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Log the error but don't crash the server
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Log the error but don't crash the server
});