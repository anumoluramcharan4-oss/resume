// ==========================================
// server.js — Main Express Server
// ==========================================
// This is the entry point for our backend.
// It connects to MongoDB and starts the HTTP server.

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// ==========================================
// Middleware Setup
// ==========================================

// CORS — Allow requests from our React frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Parse incoming JSON request bodies
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ==========================================
// API Routes
// ==========================================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/resumes", require("./routes/resume"));
app.use("/api/ai", require("./routes/ai"));
app.use("/api/jobs", require("./routes/jobs"));

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "✅ Server is running",
    time: new Date().toISOString(),
  });
});

// ==========================================
// Error Handling Middleware
// ==========================================
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({
    message: err.message || "Internal server error",
  });
});

// ==========================================
// Start Server
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
});
