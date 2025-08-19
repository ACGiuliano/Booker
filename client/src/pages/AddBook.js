import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Stylesheets/AddBook.css';

function AddBook() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com'
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('search'); // 'search' or 'manual'
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [errors, setErrors] = useState({});

  // Manual entry form data
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    pages: '',
    genre: '',
    description: '',
    publishedDate: '',
    publisher: '',
    language: 'English',
    status: 'want-to-read'
  });

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const searchBooks = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const response = await fetch(`http://localhost:5000/api/books/search/openlibrary?q=${encodeURIComponent(searchQuery.trim())}&limit=15`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const books = await response.json();
      setSearchResults(books);
      
      if (books.length === 0) {
        setErrors({ search: 'No books found for your search query' });
      }
    } catch (error) {
      console.error('Search error:', error);
      setErrors({ search: 'Failed to search books. Please try again.' });
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addBookFromSearch = (book) => {
    // Add the selected book to user's library
    const bookToAdd = {
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      pages: book.pages,
      genre: book.subjects && book.subjects.length > 0 ? book.subjects[0] : 'Unknown',
      description: book.description || 'No description available',
      publishedDate: book.firstPublishYear ? `${book.firstPublishYear}-01-01` : '',
      publisher: book.publishers && book.publishers.length > 0 ? book.publishers[0] : 'Unknown',
      coverUrl: book.coverUrl,
      openLibraryKey: book.openLibraryKey,
      status: 'want-to-read',
      progress: 0,
      dateAdded: new Date().toISOString().split('T')[0],
      currentPage: 0,
      rating: null,
      notes: ''
    };

    // Send to backend eventually
    console.log('Adding book from search:', bookToAdd);
    
    // Show success message and redirect
    alert(`"${book.title}" has been added to your library!`);
    navigate('/my-books');
  };

  const validateManualForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (formData.pages && (isNaN(formData.pages) || parseInt(formData.pages) <= 0)) {
      newErrors.pages = 'Pages must be a positive number';
    }

    return newErrors;
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateManualForm();

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      
      // Create book object
      const bookToAdd = {
        ...formData,
        id: Date.now(), // Backend will eventually do this
        pages: formData.pages ? parseInt(formData.pages) : null,
        dateAdded: new Date().toISOString().split('T')[0],
        dateStarted: null,
        dateFinished: null,
        currentPage: 0,
        progress: 0,
        rating: null,
        notes: '',
        cover: '📖' // Default cover
      };

      // Send to backend eventually
      console.log('Adding manual book:', bookToAdd);
      
      setTimeout(() => {
        setIsLoading(false);
        alert(`"${formData.title}" has been added to your library!`);
        navigate('/my-books');
      }, 1000);
    } else {
      setErrors(newErrors);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && activeTab === 'search') {
      e.preventDefault();
      searchBooks();
    }
  };

  const genres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction', 
    'Fantasy', 'Thriller', 'Horror', 'Biography', 'History', 
    'Self-Help', 'Business', 'Classic Literature', 'Young Adult',
    'Children\'s', 'Poetry', 'Drama', 'Philosophy', 'Science', 'Other'
  ];

  const readingStatuses = [
    { value: 'want-to-read', label: 'Want to Read' },
    { value: 'reading', label: 'Currently Reading' },
    { value: 'completed', label: 'Completed' }
  ];

  return (
    <div className="add-book">
      {/* Header */}
      <header className="dashboard-header">
        <div className="container">
          <div className="logo">
            <Link to="/dashboard">
              <h1>📚 Booker</h1>
            </Link>
          </div>
          <nav className="dashboard-nav">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
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
      <main className="add-book-main">
        <div className="container">
          <div className="page-header">
            <h1>Add a New Book</h1>
            <p>Search our database or manually add book information to your library</p>
          </div>

          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button 
              className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
              onClick={() => setActiveTab('search')}
            >
              🔍 Search Books
            </button>
            <button 
              className={`tab-button ${activeTab === 'manual' ? 'active' : ''}`}
              onClick={() => setActiveTab('manual')}
            >
              ✏️ Manual Entry
            </button>
          </div>

          {/* Search Tab */}
          {activeTab === 'search' && (
            <div className="search-section">
              <div className="search-form">
                <div className="search-input-group">
                  <input
                    type="text"
                    placeholder="Search by title, author, or ISBN..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyPress={handleKeyPress}
                    className="search-input"
                  />
                  <button 
                    onClick={searchBooks}
                    className="search-button"
                    disabled={isLoading || !searchQuery.trim()}
                  >
                    {isLoading ? 'Searching...' : 'Search'}
                  </button>
                </div>
                {errors.search && (
                  <div className="error-message" style={{ marginTop: '1rem', color: '#ef4444' }}>
                    {errors.search}
                  </div>
                )}
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="search-results">
                  <h3>Search Results from Open Library</h3>
                  <div className="results-grid">
                    {searchResults.map((book, index) => (
                      <div key={book.openLibraryKey || index} className="result-card">
                        <div className="book-thumbnail">
                          {book.coverUrl ? (
                            <img 
                              src={book.coverUrl} 
                              alt={book.title}
                              style={{ width: '80px', height: '120px', objectFit: 'cover', borderRadius: '4px' }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            style={{ 
                              display: book.coverUrl ? 'none' : 'flex',
                              fontSize: '3rem',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '80px',
                              height: '120px',
                              backgroundColor: '#f3f4f6',
                              borderRadius: '4px'
                            }}
                          >
                            📖
                          </div>
                        </div>
                        <div className="book-details">
                          <h4 className="book-title">{book.title}</h4>
                          <p className="book-author">by {book.author}</p>
                          <p className="book-meta">
                            {book.firstPublishYear && `Published: ${book.firstPublishYear}`}
                            {book.pages && ` • ${book.pages} pages`}
                            {book.isbn && ` • ISBN: ${book.isbn}`}
                          </p>
                          {book.subjects && book.subjects.length > 0 && (
                            <p className="book-genre">{book.subjects[0]}</p>
                          )}
                          {book.publishers && book.publishers.length > 0 && (
                            <p className="book-meta">Publisher: {book.publishers[0]}</p>
                          )}
                        </div>
                        <div className="book-actions">
                          <button 
                            onClick={() => addBookFromSearch(book)}
                            className="btn btn-primary"
                          >
                            Add to Library
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchQuery && searchResults.length === 0 && !isLoading && (
                <div className="no-results">
                  <p>No books found for "{searchQuery}". Try different keywords or add the book manually.</p>
                  <button 
                    onClick={() => setActiveTab('manual')}
                    className="btn btn-secondary"
                  >
                    Add Manually
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Manual Entry Tab */}
          {activeTab === 'manual' && (
            <div className="manual-section">
              <form onSubmit={handleManualSubmit} className="manual-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="title">Title *</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      className={errors.title ? 'error' : ''}
                      placeholder="Enter book title"
                      disabled={isLoading}
                    />
                    {errors.title && <span className="error-message">{errors.title}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="author">Author *</label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleFormChange}
                      className={errors.author ? 'error' : ''}
                      placeholder="Enter author name"
                      disabled={isLoading}
                    />
                    {errors.author && <span className="error-message">{errors.author}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="isbn">ISBN</label>
                    <input
                      type="text"
                      id="isbn"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleFormChange}
                      placeholder="Enter ISBN (optional)"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="pages">Pages</label>
                    <input
                      type="number"
                      id="pages"
                      name="pages"
                      value={formData.pages}
                      onChange={handleFormChange}
                      className={errors.pages ? 'error' : ''}
                      placeholder="Number of pages"
                      min="1"
                      disabled={isLoading}
                    />
                    {errors.pages && <span className="error-message">{errors.pages}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="genre">Genre</label>
                    <select
                      id="genre"
                      name="genre"
                      value={formData.genre}
                      onChange={handleFormChange}
                      disabled={isLoading}
                    >
                      <option value="">Select a genre (optional)</option>
                      {genres.map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="status">Reading Status</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      disabled={isLoading}
                    >
                      {readingStatuses.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="publishedDate">Publication Date</label>
                    <input
                      type="date"
                      id="publishedDate"
                      name="publishedDate"
                      value={formData.publishedDate}
                      onChange={handleFormChange}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="publisher">Publisher</label>
                    <input
                      type="text"
                      id="publisher"
                      name="publisher"
                      value={formData.publisher}
                      onChange={handleFormChange}
                      placeholder="Enter publisher name"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="language">Language</label>
                    <select
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleFormChange}
                      disabled={isLoading}
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Italian">Italian</option>
                      <option value="Portuguese">Portuguese</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows="4"
                    placeholder="Enter a brief description (optional)"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-actions">
                  <Link to="/my-books" className="btn btn-secondary">
                    Cancel
                  </Link>
                  <button 
                    type="submit" 
                    className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Adding Book...' : 'Add Book'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AddBook;
