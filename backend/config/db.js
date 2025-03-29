const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGO_URI exists and log it for debugging
    console.log('Attempting MongoDB connection with URI:', 
      process.env.MONGO_URI ? 'URI exists' : 'URI is missing');

    if (!process.env.MONGO_URI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;

  } catch (error) {
    console.error('MongoDB Connection Error:', {
      message: error.message,
      code: error.code,
      name: error.name
    });
    process.exit(1);
  }
};

module.exports = connectDB;