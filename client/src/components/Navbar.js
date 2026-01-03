import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-brand">
        <div className="logo slide-in">
          <span className="logo-icon">🏢</span>
          <span className="logo-text">DayFlow</span>
        </div>
      </div>
      
      <div className="navbar-nav">
        <button 
          onClick={() => navigate('/dashboard')}
          className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          <span className="nav-icon">📊</span>
          {user?.role === 'admin' ? 'Team' : 'Dashboard'}
        </button>
        
        <button 
          onClick={() => navigate('/attendance')}
          className={`nav-link ${location.pathname === '/attendance' ? 'active' : ''}`}
        >
          <span className="nav-icon">⏰</span>
          Attendance
        </button>
        
        <button 
          onClick={() => navigate('/leaves')}
          className={`nav-link ${location.pathname === '/leaves' ? 'active' : ''}`}
        >
          <span className="nav-icon">🏖️</span>
          Time Off
        </button>
        
        <button 
          onClick={() => navigate('/profile')}
          className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
        >
          <span className="nav-icon">👤</span>
          Profile
        </button>
      </div>

      <div className="navbar-user">
        <div className="user-info slide-in">
          <div className="user-avatar pulse">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.role}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <span className="logout-icon">🚪</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;