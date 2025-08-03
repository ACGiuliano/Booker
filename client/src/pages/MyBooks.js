import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Stylesheets/MyBooks.css';

function MyBooks() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com'
  });

  const [books, setBooks] = useState([
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      status: "reading",
      progress: 65,
      rating: null,
      cover: "📖",
      dateAdded: "2025-01-10",
      dateStarted: "2025-01-15",
      dateFinished: null,
      totalPages: 180,
      currentPage: 117,
      genre: "Classic Literature",
      notes: "Beautiful prose and symbolism"
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      status: "completed",
      progress: 100,
      rating: 5,
      cover: "📚",
      dateAdded: "2024-12-05",
      dateStarted: "2024-12-10",
      dateFinished: "2025-01-05",
      totalPages: 281,
      currentPage: 281,
      genre: "Classic Literature",
      notes: "Powerful message about justice and morality"
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      status: "reading",
      progress: 23,
      rating: null,
      cover: "📘",
      dateAdded: "2025-01-20",
      dateStarted: "2025-01-22",
      dateFinished: null,
      totalPages: 328,
      currentPage: 75,
      genre: "Dystopian Fiction",
      notes: "Thought-provoking and relevant"
    },
    {
      id: 4,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      status: "want-to-read",
      progress: 0,
      rating: null,
      cover: "💕",
      dateAdded: "2025-01-25",
      dateStarted: null,
      dateFinished: null,
      totalPages: 432,
      currentPage: 0,
      genre: "Romance",
      notes: ""
    },
    {
      id: 5,
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      status: "completed",
      progress: 100,
      rating: 4,
      cover: "📕",
      dateAdded: "2024-11-15",
      dateStarted: "2024-11-20",
      dateFinished: "2024-12-02",
      totalPages: 277,
      currentPage: 277,
      genre: "Coming of Age",
      notes: "Interesting perspective on adolescence"
    },
    {
      id: 6,
      title: "Dune",
      author: "Frank Herbert",
      status: "reading",
      progress: 45,
      rating: null,
      cover: "🏜️",
      dateAdded: "2024-12-28",
      dateStarted: "2025-01-02",
      dateFinished: null,
      totalPages: 688,
      currentPage: 310,
      genre: "Science Fiction",
      notes: "Complex world-building"
    }
  ]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  const getFilteredBooks = () => {
    let filtered = books;

    // Filter by status
    if (activeFilter !== 'all') {
      filtered = filtered.filter(book => book.status === activeFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort books
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'progress':
          return b.progress - a.progress;
        case 'dateAdded':
        default:
          return new Date(b.dateAdded) - new Date(a.dateAdded);
      }
    });

    return filtered;
  };

  const getBookStats = () => {
    const total = books.length;
    const reading = books.filter(book => book.status === 'reading').length;
    const completed = books.filter(book => book.status === 'completed').length;
    const wantToRead = books.filter(book => book.status === 'want-to-read').length;
    const totalPages = books.reduce((sum, book) => sum + (book.currentPage || 0), 0);
    const avgRating = books.filter(book => book.rating).reduce((sum, book, _, arr) => sum + book.rating / arr.length, 0);

    return { total, reading, completed, wantToRead, totalPages, avgRating: avgRating.toFixed(1) };
  };

  const updateBookProgress = (bookId, newCurrentPage) => {
    setBooks(books.map(book => {
      if (book.id === bookId) {
        const currentPage = Math.min(Math.max(0, newCurrentPage), book.totalPages);
        const newProgress = Math.round((currentPage / book.totalPages) * 100);
        return {
          ...book, 
          progress: newProgress,
          currentPage: currentPage,
          status: newProgress === 100 ? 'completed' : book.status === 'want-to-read' ? 'reading' : book.status,
          dateStarted: book.dateStarted || new Date().toISOString().split('T')[0],
          dateFinished: newProgress === 100 ? new Date().toISOString().split('T')[0] : null
        };
      }
      return book;
    }));
  };

  const updateBookRating = (bookId, rating) => {
    setBooks(books.map(book => 
      book.id === bookId ? { ...book, rating } : book
    ));
  };

  const filteredBooks = getFilteredBooks();
  const stats = getBookStats();

  return (
    <div className="my-books">
      {/* Header */}
      <header className="books-header">
        <div className="container">
          <div className="logo">
            <Link to="/dashboard">
              <h1>📚 Booker</h1>
            </Link>
          </div>
          <nav className="books-nav">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/my-books" className="nav-link active">My Books</Link>
            <Link to="/discover" className="nav-link">Discover</Link>
            <Link to="/goals" className="nav-link">Goals</Link>
            <div className="user-menu">
              <button 
                className="user-avatar" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {user.firstName[0]}{user.lastName[0]}
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
      <main className="books-main">
        <div className="container">
          {/* Page Header */}
          <div className="page-header">
            <div className="page-title-section">
              <h1>My Books</h1>
              <p>Manage your personal library and track your reading progress</p>
            </div>
            <div className="page-actions">
              <Link to="/add-book" className="btn btn-primary">
                📖 Add Book
              </Link>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="books-stats">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.total}</div>
                  <div className="stat-label">Total Books</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📖</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.reading}</div>
                  <div className="stat-label">Currently Reading</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.completed}</div>
                  <div className="stat-label">Completed</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.wantToRead}</div>
                  <div className="stat-label">Want to Read</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📄</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.totalPages.toLocaleString()}</div>
                  <div className="stat-label">Pages Read</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.avgRating}</div>
                  <div className="stat-label">Avg Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="books-controls">
            <div className="filters-section">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search books, authors, or genres..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="search-icon">🔍</span>
              </div>
              
              <div className="filter-tabs">
                <button 
                  className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('all')}
                >
                  All ({books.length})
                </button>
                <button 
                  className={`filter-tab ${activeFilter === 'reading' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('reading')}
                >
                  Reading ({stats.reading})
                </button>
                <button 
                  className={`filter-tab ${activeFilter === 'completed' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('completed')}
                >
                  Completed ({stats.completed})
                </button>
                <button 
                  className={`filter-tab ${activeFilter === 'want-to-read' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('want-to-read')}
                >
                  Want to Read ({stats.wantToRead})
                </button>
              </div>
            </div>

            <div className="view-controls">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="dateAdded">Date Added</option>
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="rating">Rating</option>
                <option value="progress">Progress</option>
              </select>

              <div className="view-toggle">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  ⊞
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  ☰
                </button>
              </div>
            </div>
          </div>

          {/* Books Display */}
          <div className="books-section">
            {filteredBooks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>No books found</h3>
                <p>
                  {searchTerm || activeFilter !== 'all' 
                    ? "Try adjusting your search or filters" 
                    : "Start building your library by adding your first book"
                  }
                </p>
                <Link to="/add-book" className="btn btn-primary">Add Your First Book</Link>
              </div>
            ) : (
              <div className={`books-${viewMode}`}>
                {filteredBooks.map(book => (
                  <div key={book.id} className={`book-${viewMode === 'grid' ? 'card' : 'row'}`}>
                    <div className="book-cover">
                      <span className="cover-emoji">{book.cover}</span>
                      {book.status === 'reading' && (
                        <div className="progress-overlay">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${book.progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="book-info">
                      <h3 className="book-title">{book.title}</h3>
                      <p className="book-author">by {book.author}</p>
                      <p className="book-genre">{book.genre}</p>
                      
                      <div className="book-meta">
                        <span className={`status-badge ${book.status}`}>
                          {book.status === 'want-to-read' ? 'Want to Read' : 
                           book.status === 'reading' ? 'Reading' : 'Completed'}
                        </span>
                        
                        {book.status === 'reading' && (
                          <span className="progress-text">
                            {book.currentPage}/{book.totalPages} pages ({book.progress}%)
                          </span>
                        )}
                        
                        {book.rating && (
                          <div className="book-rating">
                            {'⭐'.repeat(book.rating)}
                          </div>
                        )}
                      </div>

                      {book.status === 'reading' && (
                        <div className="progress-controls">
                          <div className="page-input-container">
                            <label htmlFor={`page-${book.id}`} className="page-label">
                              Current Page:
                            </label>
                            <div className="page-input-wrapper">
                              <input
                                type="number"
                                id={`page-${book.id}`}
                                min="0"
                                max={book.totalPages}
                                value={book.currentPage}
                                onChange={(e) => updateBookProgress(book.id, parseInt(e.target.value) || 0)}
                                className="page-input"
                              />
                              <span className="page-total">/ {book.totalPages}</span>
                            </div>
                            <div className="progress-indicator">
                              {book.progress}% complete
                            </div>
                          </div>
                        </div>
                      )}

                      {book.status === 'completed' && !book.rating && (
                        <div className="rating-controls">
                          <span>Rate this book:</span>
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              onClick={() => updateBookRating(book.id, star)}
                              className="star-btn"
                            >
                              ⭐
                            </button>
                          ))}
                        </div>
                      )}

                      {book.notes && (
                        <p className="book-notes">{book.notes}</p>
                      )}
                    </div>

                    <div className="book-actions">
                      <button className="action-btn">✏️</button>
                      <button className="action-btn">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default MyBooks;
