// =============================================
// routes/expenseRoutes.js - Expense Routes (Protected)
// =============================================

const express = require("express");
const router = express.Router();
const { getExpenses, addExpense, deleteExpense } = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");

// All expense routes are protected — user must be logged in

// GET /api/expenses - Get all expenses for the logged-in user
router.get("/", protect, getExpenses);

// POST /api/expenses - Add a new expense
router.post("/", protect, addExpense);

// DELETE /api/expenses/:id - Delete a specific expense
router.delete("/:id", protect, deleteExpense);

module.exports = router;
