import React from 'react';
import { Link } from 'react-router-dom';
import '../Stylesheets/Home.css';

function Home() {
  return (
    <div className="home">
      {/* Header/Navigation */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <h1>📚 Booker</h1>
          </div>
          <nav className="nav">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link nav-link-primary">Sign Up</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Track Your Reading Journey
            </h1>
            <p className="hero-subtitle">
              Organize your books, set reading goals, and discover your next favorite read with Booker.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">Get Started Free</Link>
              <Link to="/login" className="btn btn-secondary">Sign In</Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="book-stack">
              <div className="book book-1">📖</div>
              <div className="book book-2">📚</div>
              <div className="book book-3">📝</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Booker?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Track Progress</h3>
              <p>Monitor your reading progress with visual charts and statistics.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Set Goals</h3>
              <p>Challenge yourself with yearly reading goals and monthly targets.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Organize Books</h3>
              <p>Create custom shelves and organize books by genre, author, or status.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Rate & Review</h3>
              <p>Rate your books and write reviews to remember your thoughts.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Discover Books</h3>
              <p>Get personalized recommendations based on your reading history.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-grid">
          <div className="stat">
            <div className="stat-number">10,000+</div>
            <div className="stat-label">Books Tracked</div>
          </div>
          <div className="stat">
            <div className="stat-number">5,000+</div>
            <div className="stat-label">Active Readers</div>
          </div>
          <div className="stat">
            <div className="stat-number">25,000+</div>
            <div className="stat-label">Reviews Written</div>
          </div>
          <div className="stat">
            <div className="stat-number">98%</div>
            <div className="stat-label">User Satisfaction</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Start Your Reading Journey?</h2>
          <p>Join thousands of readers who are already tracking their books with Booker.</p>
          <Link to="/register" className="btn btn-primary btn-large">Sign Up Now - It's Free!</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>📚 Booker</h3>
              <p>Your personal book tracking companion.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <Link to="/login">Login</Link>
              <Link to="/register">Sign Up</Link>
            </div>
            <div className="footer-section">
              <h4>Features</h4>
              <a href="#features">Track Progress</a>
              <a href="#features">Set Goals</a>
              <a href="#features">Organize Books</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Booker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;