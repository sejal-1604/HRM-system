import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import './Auth.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'employee'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: formData.companyName || 'Default Company',
          name: formData.name,
          email: formData.email,
          phone: formData.phone || '0000000000',
          password: formData.password,
          role: formData.role
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccess({
          message: 'Account created successfully!',
          loginId: data.loginId,
          email: formData.email,
          password: formData.password
        });
        // Don't auto-navigate, let user see credentials
      } else {
        setError(data.error || 'Sign up failed');
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
          <h2>Create Account</h2>
          <p>Join our HRMS platform today</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
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
              placeholder="Create a strong password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Account Type</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="role-select"
              required
            >
              <option value="employee">Employee</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && typeof success === 'object' && (
            <div className="success-credentials">
              <h3>✅ {success.message}</h3>
              <div className="credentials-box">
                <p><strong>Your Login Credentials:</strong></p>
                <p><strong>Login ID:</strong> {success.loginId}</p>
                <p><strong>Email:</strong> {success.email}</p>
                <p><strong>Password:</strong> [Hidden for security]</p>
                <p className="note">⚠️ Please save your Login ID. A copy has been sent to your email.</p>
              </div>
              <button 
                className="auth-button" 
                onClick={() => navigate('/signin')}
                style={{ marginTop: '15px' }}
              >
                Go to Sign In
              </button>
            </div>
          )}
          {success && typeof success === 'string' && (
            <div className="success-message">{success}</div>
          )}

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <a href="/signin">Sign in</a></p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;