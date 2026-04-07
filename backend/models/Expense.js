// =============================================
// models/Expense.js - Expense Schema & Model
// =============================================

const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    // Title/description of the expense
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    // Amount spent
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be positive"],
    },

    // Category of expense
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Food", "Travel", "Shopping", "Bills", "Health", "Other"],
      default: "Other",
    },

    // Date of expense
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },

    // Reference to the User who created this expense
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Expense", expenseSchema);
