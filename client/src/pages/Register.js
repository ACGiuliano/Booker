import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Stylesheets/Register.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      // Form is valid, submit the data
      console.log('Form submitted:', formData);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        // Store user token/session data
        localStorage.setItem('userToken', 'mock-jwt-token');
        localStorage.setItem('user', JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email
        }));
        // Redirect to dashboard
        navigate('/dashboard');
      }, 1000);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="register">
      {/* Header */}
      <header className="register-header">
        <div className="container">
          <Link to="/" className="logo">
            <h1>📚 Booker</h1>
          </Link>
          <nav className="nav">
            <Link to="/login" className="nav-link">Already have an account? Sign In</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="register-main">
        <div className="register-container">
          <div className="register-content">
            <div className="register-form-section">
              <div className="form-header">
                <h2>Create Your Account</h2>
                <p>Start tracking your reading journey today</p>
              </div>

              <form onSubmit={handleSubmit} className="register-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={errors.firstName ? 'error' : ''}
                      placeholder="Enter your first name"
                      disabled={isLoading}
                    />
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={errors.lastName ? 'error' : ''}
                      placeholder="Enter your last name"
                      disabled={isLoading}
                    />
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                  </div>
                </div>

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
                    placeholder="Create a password (min. 6 characters)"
                    disabled={isLoading}
                  />
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? 'error' : ''}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                  />
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>

                <button 
                  type="submit" 
                  className={`btn btn-primary btn-full ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>

                <div className="form-footer">
                  <p>
                    Already have an account? <Link to="/login">Sign in here</Link>
                  </p>
                </div>
              </form>
            </div>

            <div className="register-info-section">
              <div className="info-content">
                <h3>Join the Booker Community</h3>
                <div className="benefits">
                  <div className="benefit">
                    <div className="benefit-icon">📊</div>
                    <div className="benefit-text">
                      <h4>Track Your Progress</h4>
                      <p>Monitor your reading habits and see your progress over time</p>
                    </div>
                  </div>
                  <div className="benefit">
                    <div className="benefit-icon">🎯</div>
                    <div className="benefit-text">
                      <h4>Set Reading Goals</h4>
                      <p>Challenge yourself with yearly and monthly reading targets</p>
                    </div>
                  </div>
                  <div className="benefit">
                    <div className="benefit-icon">📚</div>
                    <div className="benefit-text">
                      <h4>Organize Your Library</h4>
                      <p>Create custom shelves and organize books by your preferences</p>
                    </div>
                  </div>
                  <div className="benefit">
                    <div className="benefit-icon">⭐</div>
                    <div className="benefit-text">
                      <h4>Rate & Review</h4>
                      <p>Remember your thoughts and share recommendations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Register;