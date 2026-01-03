import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import './Auth.css';

const SignIn = () => {
  const [formData, setFormData] = useState({
    login_id: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: formData.login_id,
          password: formData.password
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        login(data.user, data.token);
        
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        setError(data.error || 'Invalid login credentials');
      }
    } catch (err) {
      setError('Server connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <div className="logo">🏢 DayFlow</div>
          <h2>Welcome Back</h2>
          <p>Sign in to access your HRMS dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="login_id">Login ID or Email</label>
            <input
              type="text"
              id="login_id"
              name="login_id"
              value={formData.login_id}
              onChange={handleChange}
              placeholder="Enter your login ID or email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </div>

        <div className="demo-accounts">
          <p><strong>Test Accounts:</strong></p>
          <p><strong>Admin:</strong> admin@testcompany.com / password123</p>
          <p><strong>Employee:</strong> john@testcompany.com / password123</p>
          <p><strong>Employee:</strong> jane@testcompany.com / password123</p>
          <p>Or create a new account using Sign Up</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;