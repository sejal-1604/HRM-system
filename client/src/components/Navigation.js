import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/signin');
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className="nav-container">
        <div className="nav-content">
          <div className="nav-brand" onClick={() => handleNavigation('/dashboard')}>
            🏢 DayFlow HRMS
          </div>
          
          <div className={`nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
            <div className="nav-links">
              <button 
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                onClick={() => handleNavigation('/dashboard')}
              >
                Dashboard
              </button>
              <button 
                className={`nav-link ${isActive('/profile') || isActive('/profile/') ? 'active' : ''}`}
                onClick={() => handleNavigation('/profile')}
              >
                Profile
              </button>
              <button 
                className={`nav-link ${isActive('/attendance') ? 'active' : ''}`}
                onClick={() => handleNavigation('/attendance')}
              >
                Attendance
              </button>
              <button 
                className={`nav-link ${isActive('/leaves') ? 'active' : ''}`}
                onClick={() => handleNavigation('/leaves')}
              >
                Leaves
              </button>
            </div>
            
            <div className="nav-actions">
              <div className="user-info">
                <span>{user?.name}</span>
                <small>({user?.role})</small>
              </div>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
          
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>
      
      <div 
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};

export default Navigation;
