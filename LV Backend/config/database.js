const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    // Check if MongoDB URI is provided
    const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URL;

    if (!mongoUri) {
      console.log(
        "[LV Backend] 📝 MongoDB URI not provided, using mock data mode"
      );
      return;
    }

    console.log("[LV Backend] 🔌 Attempting to connect to MongoDB...");

    const conn = await mongoose.connect(mongoUri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("📝 MongoDB not available, using mock data mode");
    console.log("✅ Server will continue with in-memory storage");

    // Don't exit the process, let the server continue running
    // This allows the API to work with mock data if MongoDB is not available
  }
};

module.exports = connectDB;
