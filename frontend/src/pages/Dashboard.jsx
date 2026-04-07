// =============================================
// src/pages/Dashboard.jsx - Protected Dashboard
// =============================================

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import './Dashboard.css';

// Category config for icons and colors
const CATEGORY_CONFIG = {
  Food:     { icon: '🍔', color: '#00f2fe' },
  Travel:   { icon: '✈️', color: '#4facfe' },
  Shopping: { icon: '🛒', color: '#a8edea' },
  Bills:    { icon: '💡', color: '#ffd166' },
  Health:   { icon: '💊', color: '#06d6a0' },
  Other:    { icon: '📦', color: '#b8b8ff' },
};

const CATEGORIES = Object.keys(CATEGORY_CONFIG);

const Dashboard = () => {
  const navigate = useNavigate();

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  // State
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // New expense form state
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
  });

  // Fetch expenses on mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/expenses');
      setExpenses(data);
    } catch (err) {
      setError('Failed to load expenses. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError('');
  };

  // Add new expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    setSuccessMsg('');

    if (!form.title.trim() || !form.amount) {
      setFormError('Please fill in all required fields.');
      setFormLoading(false);
      return;
    }

    try {
      const { data } = await api.post('/expenses', {
        ...form,
        amount: parseFloat(form.amount),
      });

      // Prepend the new expense to the list (newest first)
      setExpenses([data.expense, ...expenses]);

      // Reset form
      setForm({
        title: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
      });

      setSuccessMsg('Expense added successfully! ✅');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add expense.');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete expense
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses(expenses.filter((e) => e._id !== id));
    } catch {
      alert('Failed to delete expense.');
    }
  };

  // Filter expenses by category
  const filteredExpenses = useMemo(() => {
    if (activeFilter === 'All') return expenses;
    return expenses.filter((e) => e.category === activeFilter);
  }, [expenses, activeFilter]);

  // Calculate total
  const totalAmount = useMemo(
    () => filteredExpenses.reduce((sum, e) => sum + e.amount, 0),
    [filteredExpenses]
  );

  // Category-wise totals for summary bar
  const categoryTotals = useMemo(() => {
    const totals = {};
    CATEGORIES.forEach((cat) => {
      totals[cat] = expenses
        .filter((e) => e.category === cat)
        .reduce((sum, e) => sum + e.amount, 0);
    });
    return totals;
  }, [expenses]);

  const grandTotal = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Format date nicely
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  return (
    <div className="dashboard-page">
      <Navbar user={user} />

      <div className="dashboard-container">
        {/* ---- PAGE HEADER ---- */}
        <div className="dashboard-header animate-fade-up">
          <div>
            <h1 className="dashboard-title">
              Your <span className="gradient-text">Expense Dashboard</span>
            </h1>
            <p className="dashboard-subtitle">
              Track, manage, and understand your spending.
            </p>
          </div>
        </div>

        {/* ---- SUMMARY CARDS ---- */}
        <div className="summary-grid animate-fade-up">
          <div className="summary-card glass-card">
            <div className="summary-icon">💰</div>
            <div className="summary-info">
              <div className="summary-label">Total Spent</div>
              <div className="summary-value">
                ₹ {grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
          <div className="summary-card glass-card">
            <div className="summary-icon">📋</div>
            <div className="summary-info">
              <div className="summary-label">Total Entries</div>
              <div className="summary-value">{expenses.length}</div>
            </div>
          </div>
          <div className="summary-card glass-card">
            <div className="summary-icon">📊</div>
            <div className="summary-info">
              <div className="summary-label">Avg. per Expense</div>
              <div className="summary-value">
                ₹ {expenses.length
                  ? (grandTotal / expenses.length).toLocaleString('en-IN', { minimumFractionDigits: 0 })
                  : '0'}
              </div>
            </div>
          </div>
          <div className="summary-card glass-card">
            <div className="summary-icon">🏆</div>
            <div className="summary-info">
              <div className="summary-label">Top Category</div>
              <div className="summary-value">
                {CATEGORIES.reduce((a, b) =>
                  categoryTotals[a] >= categoryTotals[b] ? a : b, CATEGORIES[0]
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-main">
          {/* ---- ADD EXPENSE FORM ---- */}
          <div className="add-expense-section">
            <div className="section-card glass-card">
              <h2 className="section-heading">➕ Add Expense</h2>

              {formError && (
                <div className="form-alert error">⚠️ {formError}</div>
              )}
              {successMsg && (
                <div className="form-alert success">{successMsg}</div>
              )}

              <form onSubmit={handleAddExpense} className="expense-form">
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g., Lunch at restaurant"
                    className="glass-input"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Amount (₹) *</label>
                    <input
                      type="number"
                      name="amount"
                      value={form.amount}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="glass-input"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="glass-input"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {CATEGORY_CONFIG[cat].icon} {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="glass-input"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary add-btn"
                  disabled={formLoading}
                >
                  {formLoading ? 'Adding...' : 'Add Expense'}
                </button>
              </form>
            </div>

            {/* Category Breakdown */}
            <div className="section-card glass-card breakdown-card">
              <h2 className="section-heading">📊 Category Breakdown</h2>
              <div className="breakdown-list">
                {CATEGORIES.map((cat) => {
                  const total = categoryTotals[cat];
                  const pct = grandTotal > 0 ? (total / grandTotal) * 100 : 0;
                  const config = CATEGORY_CONFIG[cat];
                  return (
                    <div key={cat} className="breakdown-item">
                      <div className="breakdown-left">
                        <span className="breakdown-icon">{config.icon}</span>
                        <span className="breakdown-name">{cat}</span>
                      </div>
                      <div className="breakdown-bar-wrap">
                        <div className="breakdown-bar-track">
                          <div
                            className="breakdown-bar-fill"
                            style={{ width: `${pct}%`, background: config.color }}
                          />
                        </div>
                        <span className="breakdown-pct">{pct.toFixed(0)}%</span>
                      </div>
                      <span className="breakdown-amount">
                        ₹{total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ---- EXPENSES LIST ---- */}
          <div className="expenses-section">
            <div className="expenses-header">
              <h2 className="section-heading">📋 My Expenses</h2>
              {/* Filter chips */}
              <div className="filter-chips">
                {['All', ...CATEGORIES].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`filter-chip ${activeFilter === cat ? 'active' : ''}`}
                  >
                    {cat !== 'All' && CATEGORY_CONFIG[cat]?.icon} {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtered total */}
            {activeFilter !== 'All' && (
              <div className="filter-total">
                Showing <strong>{filteredExpenses.length}</strong> expenses in{' '}
                <strong>{activeFilter}</strong> — Total:{' '}
                <span className="gradient-text">
                  ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="loading-state">
                <div className="loading-spinner" />
                <p>Loading your expenses...</p>
              </div>
            )}

            {/* Error state */}
            {error && !loading && (
              <div className="form-alert error">{error}</div>
            )}

            {/* Empty state */}
            {!loading && !error && filteredExpenses.length === 0 && (
              <div className="empty-state glass-card">
                <div className="empty-icon">💸</div>
                <h3>No expenses yet</h3>
                <p>
                  {activeFilter !== 'All'
                    ? `No expenses in the "${activeFilter}" category.`
                    : 'Add your first expense using the form.'}
                </p>
              </div>
            )}

            {/* Expense Cards Grid */}
            {!loading && filteredExpenses.length > 0 && (
              <div className="expenses-grid">
                {filteredExpenses.map((expense) => {
                  const config = CATEGORY_CONFIG[expense.category] || CATEGORY_CONFIG.Other;
                  return (
                    <div key={expense._id} className="expense-card glass-card">
                      <div className="expense-card-top">
                        <div
                          className="expense-cat-icon"
                          style={{ background: `${config.color}20`, border: `1px solid ${config.color}40` }}
                        >
                          {config.icon}
                        </div>
                        <div className="expense-meta">
                          <span
                            className="expense-category-tag"
                            style={{ color: config.color }}
                          >
                            {expense.category}
                          </span>
                          <span className="expense-date">{formatDate(expense.date)}</span>
                        </div>
                        <button
                          onClick={() => handleDelete(expense._id)}
                          className="delete-btn"
                          title="Delete expense"
                        >
                          🗑️
                        </button>
                      </div>
                      <div className="expense-title">{expense.title}</div>
                      <div className="expense-amount">
                        ₹ {expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
