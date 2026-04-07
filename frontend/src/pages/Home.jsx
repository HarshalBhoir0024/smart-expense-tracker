// =============================================
// src/pages/Home.jsx - Landing Page
// =============================================

import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Home.css';

// Feature cards data
const features = [
  {
    icon: '📊',
    title: 'Smart Analytics',
    desc: 'Visualize your spending patterns with beautiful charts and real-time insights.',
  },
  {
    icon: '🎯',
    title: 'Budget Tracking',
    desc: 'Set goals and track every rupee. Stay on top of your financial health effortlessly.',
  },
  {
    icon: '📋',
    title: 'Detailed Reports',
    desc: 'Category-wise breakdowns, monthly summaries, and exportable expense reports.',
  },
  {
    icon: '🔒',
    title: 'Secure & Private',
    desc: 'Your data is encrypted and protected. Only you can see your financial info.',
  },
];

const Home = () => {
  // Check if user is already logged in
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="home-page">
      <Navbar user={user} />

      {/* ---- HERO SECTION ---- */}
      <section className="hero-section">
        <div className="hero-content animate-fade-left">
          <div className="hero-badge">✨ Smart Finance Management</div>
          <h1 className="hero-title">
            Track Every <span className="gradient-text">Expense</span>,
            <br />
            Master Your <span className="gradient-text">Money</span>
          </h1>
          <p className="hero-subtitle">
            The intelligent expense tracker that helps you understand where your money
            goes — so you can make smarter financial decisions, every single day.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/dashboard" className="btn-primary">
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary">
                  Start for Free →
                </Link>
                <Link to="/login" className="btn-ghost">
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Stats Row */}
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Users</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">₹2Cr+</span>
              <span className="stat-label">Tracked</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Uptime</span>
            </div>
          </div>
        </div>

        {/* Animated Floating Hero Illustration */}
        <div className="hero-visual animate-fade-up">
          <div className="floating-card" style={{ animationDelay: '0s' }}>
            <div className="float-card-inner">
              <span className="float-icon">🛒</span>
              <div>
                <div className="float-title">Shopping</div>
                <div className="float-amount">- ₹2,450</div>
              </div>
            </div>
          </div>

          <div className="hero-dashboard-preview">
            <div className="preview-header">
              <span className="preview-dot red" />
              <span className="preview-dot yellow" />
              <span className="preview-dot green" />
              <span className="preview-title">My Dashboard</span>
            </div>
            <div className="preview-total-label">Total Spent This Month</div>
            <div className="preview-total">₹ 18,340</div>
            <div className="preview-bar-group">
              {[
                { label: 'Food', pct: 70, color: '#00f2fe' },
                { label: 'Travel', pct: 45, color: '#4facfe' },
                { label: 'Shopping', pct: 55, color: '#a8edea' },
              ].map((b) => (
                <div key={b.label} className="preview-bar-row">
                  <span className="preview-bar-label">{b.label}</span>
                  <div className="preview-bar-track">
                    <div
                      className="preview-bar-fill"
                      style={{ width: `${b.pct}%`, background: b.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="preview-chips">
              <span className="preview-chip">📈 Up 12%</span>
              <span className="preview-chip green">✅ On Budget</span>
            </div>
          </div>

          <div className="floating-card right" style={{ animationDelay: '1.5s' }}>
            <div className="float-card-inner">
              <span className="float-icon">✈️</span>
              <div>
                <div className="float-title">Travel</div>
                <div className="float-amount">- ₹5,200</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- FEATURES SECTION ---- */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">
            Everything you need to <span className="gradient-text">stay in control</span>
          </h2>
          <p className="section-subtitle">
            Powerful features designed to make expense tracking effortless and insightful.
          </p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div
              key={i}
              className="feature-card glass-card"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- CTA SECTION ---- */}
      <section className="cta-section">
        <div className="cta-card glass-card">
          <h2 className="cta-title">Ready to take control of your finances?</h2>
          <p className="cta-sub">Join thousands who track smarter with ExpenseIQ.</p>
          <Link to="/register" className="btn-primary">
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>© 2024 ExpenseIQ · Built with ❤️ using MERN Stack</p>
      </footer>
    </div>
  );
};

export default Home;
