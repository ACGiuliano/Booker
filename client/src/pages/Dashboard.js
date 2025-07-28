import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Stylesheets/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    joinDate: '2025-01-15'
  });

  const [stats, setStats] = useState({
    totalBooks: 42,
    currentlyReading: 3,
    completedThisYear: 15,
    readingGoal: 50,
    averageRating: 4.2,
    totalPages: 12453
  });

  const [recentBooks, setRecentBooks] = useState([
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      status: "reading",
      progress: 65,
      rating: null,
      cover: "📖"
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      status: "completed",
      progress: 100,
      rating: 5,
      cover: "📚"
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      status: "reading",
      progress: 23,
      rating: null,
      cover: "📘"
    }
  ]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check if user is logged in and get user data
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(prevUser => ({
          ...prevUser,
          ...parsedUser,
          joinDate: new Date().toISOString().split('T')[0] // Today's date as join date
        }));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear user session/token here
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  const progressPercentage = (stats.completedThisYear / stats.readingGoal) * 100;

  return (
    <div className="dashboard">
      {/* Header/Navigation */}
      <header className="dashboard-header">
        <div className="container">
          <div className="logo">
            <Link to="/dashboard">
              <h1>📚 Booker</h1>
            </Link>
          </div>
          <nav className="dashboard-nav">
            <Link to="/dashboard" className="nav-link active">Dashboard</Link>
            <Link to="/my-books" className="nav-link">My Books</Link>
            <Link to="/discover" className="nav-link">Discover</Link>
            <Link to="/goals" className="nav-link">Goals</Link>
            <div className="user-menu">
              <button 
                className="user-avatar"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </button>
              {isMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <p className="user-name">{user.firstName} {user.lastName}</p>
                    <p className="user-email">{user.email}</p>
                  </div>
                  <hr />
                  <Link to="/profile" className="dropdown-link">Profile Settings</Link>
                  <Link to="/preferences" className="dropdown-link">Preferences</Link>
                  <hr />
                  <button onClick={handleLogout} className="dropdown-link logout">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="container">
          {/* Welcome Section */}
          <section className="welcome-section">
            <div className="welcome-content">
              <h1>Welcome back, {user.firstName}! 📚</h1>
              <p>Ready to continue your reading journey?</p>
            </div>
            <div className="quick-actions">
              <Link to="/add-book" className="btn btn-primary">+ Add Book</Link>
              <Link to="/discover" className="btn btn-secondary">Discover Books</Link>
            </div>
          </section>

          {/* Stats Overview */}
          <section className="stats-section">
            <h2 className="section-title">Your Reading Stats</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.totalBooks}</div>
                  <div className="stat-label">Total Books</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📖</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.currentlyReading}</div>
                  <div className="stat-label">Currently Reading</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.completedThisYear}</div>
                  <div className="stat-label">Completed This Year</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.averageRating}</div>
                  <div className="stat-label">Average Rating</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📄</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.totalPages.toLocaleString()}</div>
                  <div className="stat-label">Total Pages Read</div>
                </div>
              </div>
            </div>
          </section>

          {/* Reading Goal Progress */}
          <section className="goal-section">
            <h2 className="section-title">2025 Reading Goal</h2>
            <div className="goal-card">
              <div className="goal-header">
                <h3>Annual Reading Challenge</h3>
                <p>{stats.completedThisYear} of {stats.readingGoal} books</p>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>
              <div className="goal-footer">
                <span className="progress-text">
                  {Math.round(progressPercentage)}% Complete
                </span>
                <span className="books-remaining">
                  {stats.readingGoal - stats.completedThisYear} books to go
                </span>
              </div>
            </div>
          </section>

          {/* Recent Books */}
          <section className="recent-books-section">
            <div className="section-header">
              <h2 className="section-title">Recent Activity</h2>
              <Link to="/my-books" className="view-all-link">View All Books →</Link>
            </div>
            <div className="books-grid">
              {recentBooks.map(book => (
                <div key={book.id} className="book-card">
                  <div className="book-cover">{book.cover}</div>
                  <div className="book-info">
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author">by {book.author}</p>
                    <div className="book-status">
                      <span className={`status-badge ${book.status}`}>
                        {book.status === 'reading' ? 'Currently Reading' : 'Completed'}
                      </span>
                      {book.status === 'reading' && (
                        <div className="reading-progress">
                          <div className="progress-bar small">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${book.progress}%` }}
                            ></div>
                          </div>
                          <span className="progress-text">{book.progress}%</span>
                        </div>
                      )}
                      {book.rating && (
                        <div className="book-rating">
                          {'⭐'.repeat(book.rating)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="book-actions">
                    <button className="btn-icon" title="Update Progress">📊</button>
                    <button className="btn-icon" title="Add Review">✏️</button>
                    <button className="btn-icon" title="More Options">⋯</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Reading Recommendations */}
          <section className="recommendations-section">
            <h2 className="section-title">Recommended for You</h2>
            <div className="recommendations-grid">
              <div className="recommendation-card">
                <div className="recommendation-icon">🔍</div>
                <h3>Discover New Books</h3>
                <p>Based on your reading history, we think you'd enjoy these genres and authors.</p>
                <Link to="/discover" className="btn btn-outline">Explore Recommendations</Link>
              </div>
              <div className="recommendation-card">
                <div className="recommendation-icon">📊</div>
                <h3>Reading Insights</h3>
                <p>See detailed analytics about your reading habits and progress over time.</p>
                <Link to="/insights" className="btn btn-outline">View Insights</Link>
              </div>
              <div className="recommendation-card">
                <div className="recommendation-icon">👥</div>
                <h3>Join Reading Groups</h3>
                <p>Connect with other readers and join book clubs discussing your favorite genres.</p>
                <Link to="/groups" className="btn btn-outline">Find Groups</Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
