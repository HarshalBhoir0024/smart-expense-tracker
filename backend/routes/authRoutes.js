// =============================================
// routes/authRoutes.js - Authentication Routes
// =============================================

const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

// POST /api/auth/register - Create a new user account
router.post("/register", registerUser);

// POST /api/auth/login - Login with email & password
router.post("/login", loginUser);

module.exports = router;
