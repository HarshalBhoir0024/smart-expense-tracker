// =============================================
// server.js - Main Express Server Entry Point
// =============================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const app = express();

// ---- Middleware ----
app.use(cors()); // Allow cross-origin requests from frontend
app.use(express.json()); // Parse incoming JSON requests

// ---- Routes ----
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Smart Expense Tracker API is running 🚀" });
});

// ---- Connect to MongoDB and Start Server ----
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });
