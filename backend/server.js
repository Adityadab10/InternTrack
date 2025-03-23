const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const cors = require("cors");
const path = require('path');
const fs = require('fs');

// Import routes
const internshipRoutes = require('./routes/internshipRoutes');
const applicationRoutes = require("./routes/applicationRoutes");
const studentProfileRoutes = require("./routes/studentProfileRoutes");

dotenv.config();
connectDB();

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use('/api/internships', internshipRoutes);
app.use("/api", applicationRoutes);
app.use("/api", studentProfileRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});