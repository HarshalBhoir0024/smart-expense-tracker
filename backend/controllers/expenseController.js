// =============================================
// controllers/expenseController.js - Expense Business Logic
// =============================================

const Expense = require("../models/Expense");

// ---- GET ALL EXPENSES ----
// GET /api/expenses
// Returns only expenses belonging to the logged-in user
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id }).sort({
      date: -1, // Sort by date descending (newest first)
    });

    res.status(200).json(expenses);
  } catch (error) {
    console.error("Get expenses error:", error.message);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
};

// ---- ADD EXPENSE ----
// POST /api/expenses
const addExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    // Validate required fields
    if (!title || !amount || !category) {
      return res.status(400).json({ message: "Title, amount, and category are required" });
    }

    // Create expense linked to the logged-in user
    const expense = await Expense.create({
      title,
      amount,
      category,
      date: date || Date.now(),
      userId: req.user._id, // From JWT middleware
    });

    res.status(201).json({
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    console.error("Add expense error:", error.message);
    res.status(500).json({ message: "Failed to add expense" });
  }
};

// ---- DELETE EXPENSE ----
// DELETE /api/expenses/:id
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    // Check if expense exists
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Ensure the expense belongs to the requesting user
    if (expense.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this expense" });
    }

    await expense.deleteOne();

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Delete expense error:", error.message);
    res.status(500).json({ message: "Failed to delete expense" });
  }
};

module.exports = { getExpenses, addExpense, deleteExpense };
