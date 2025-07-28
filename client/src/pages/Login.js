import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Stylesheets/Login.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prevState => ({
        ...prevState,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        // API call would go here
        console.log('Login attempt:', formData);
        // Simulate API call
        setTimeout(() => {
          setIsLoading(false);
          // Store user token/session data
          localStorage.setItem('userToken', 'mock-jwt-token');
          localStorage.setItem('user', JSON.stringify({
            firstName: formData.email.split('@')[0],
            lastName: 'User',
            email: formData.email
          }));
          // Redirect to dashboard
          navigate('/dashboard');
        }, 1000);
      } catch (err) {
        setIsLoading(false);
        setErrors({ general: 'Login failed. Please check your credentials.' });
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="login">
      {/* Header */}
      <header className="login-header">
        <div className="container">
          <Link to="/" className="logo">
            <h1>📚 Booker</h1>
          </Link>
          <nav className="nav">
            <Link to="/register" className="nav-link">Don't have an account? Sign Up</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="login-main">
        <div className="login-container">
          <div className="login-content">
            <div className="login-form-section">
              <div className="form-header">
                <h2>Welcome Back</h2>
                <p>Sign in to continue your reading journey</p>
              </div>

              {errors.general && (
                <div className="error-banner">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="Enter your email address"
                    disabled={isLoading}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'error' : ''}
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <div className="form-options">
                  <label className="checkbox-container">
                    <input type="checkbox" />
                    <span className="checkmark"></span>
                    Remember me
                  </label>
                  <a href="#" className="forgot-password">Forgot password?</a>
                </div>

                <button 
                  type="submit" 
                  className={`btn btn-primary btn-full ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>

                <div className="form-footer">
                  <p>
                    Don't have an account? <Link to="/register">Create one here</Link>
                  </p>
                </div>
              </form>
            </div>

            <div className="login-welcome-section">
              <div className="welcome-content">
                <div className="welcome-icon">📚</div>
                <h3>Continue Your Reading Journey</h3>
                <p>Welcome back to Booker! We're excited to see what you've been reading.</p>
                
                <div className="login-stats">
                  <div className="login-stat">
                    <div className="login-stat-number">10,000+</div>
                    <div className="login-stat-label">Books Tracked</div>
                  </div>
                  <div className="login-stat">
                    <div className="login-stat-number">5,000+</div>
                    <div className="login-stat-label">Active Readers</div>
                  </div>
                </div>

                <div className="features-reminder">
                  <h4>What's waiting for you:</h4>
                  <ul>
                    <li>📊 Your reading progress and stats</li>
                    <li>📚 Your personal book library</li>
                    <li>🎯 Your reading goals and achievements</li>
                    <li>⭐ Your reviews and ratings</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
