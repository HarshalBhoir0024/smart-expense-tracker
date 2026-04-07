// =============================================
// src/components/Navbar.jsx - Navigation Bar
// =============================================

import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  // Logout: Clear localStorage and redirect to home
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">💸</span>
          <span className="logo-text">ExpenseIQ</span>
        </Link>

        {/* Right side */}
        <div className="navbar-right">
          {user ? (
            // Logged-in state: show user name and logout button
            <>
              <div className="user-badge">
                <div className="user-avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="user-name">Hi, {user.name?.split(' ')[0]}</span>
              </div>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            // Guest state: show login and register links
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn-primary nav-btn">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
