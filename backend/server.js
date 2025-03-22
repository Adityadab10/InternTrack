const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const internshipRoutes = require('./routes/internshipRoutes');
const errorHandler = require('./middleware/errorHandler');
const cors = require("cors");
const appliedInternshipRoutes = require("./routes/appliedInternshipRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/internships', internshipRoutes);
app.use("/api/applied-internships", appliedInternshipRoutes);
app.use("/api", applicationRoutes); // Add the /api prefix to the application routes

// Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});