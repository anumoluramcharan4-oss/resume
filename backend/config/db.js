// ==========================================
// config/db.js — MongoDB Connection
// ==========================================
// This file connects our Express app to MongoDB using Mongoose.
// Mongoose makes it easy to work with MongoDB by using "models" (schemas).

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI || process.env.MONGO_URI === "mongodb://localhost:27017/careergrowth") {
      // Check if we're trying local MongoDB
      const uri = process.env.MONGO_URI || "mongodb://localhost:27017/careergrowth";
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } else {
      const conn = await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    }
  } catch (error) {
    console.error(`\n❌ MongoDB Connection Failed!`);
    console.error(`Error: ${error.message}\n`);
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error("🔧 HOW TO FIX:");
    console.error("");
    console.error("Option 1 — Use MongoDB Atlas (FREE cloud, recommended):");
    console.error("  1. Go to https://cloud.mongodb.com");
    console.error("  2. Create a free account → New Project → Free Cluster");
    console.error("  3. Click Connect → Drivers → Copy the URI");
    console.error("  4. Paste it in backend/.env as:");
    console.error("     MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/careergrowth");
    console.error("");
    console.error("Option 2 — Install MongoDB locally:");
    console.error("  brew tap mongodb/brew");
    console.error("  brew install mongodb-community");
    console.error("  brew services start mongodb-community");
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    process.exit(1);
  }
};

module.exports = connectDB;
