const express = require('express');
const router = express.Router();
const { db, searchBooks } = require('../db');
const { authenticateToken } = require('./auth');
const openLibraryService = require('../services/openLibraryService');

// Search books in Open Library
router.get('/search/openlibrary', async (req, res) => {
  try {
    const query = req.query.q;
    const limit = parseInt(req.query.limit) || 10;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters long' });
    }
    
    const books = await openLibraryService.searchBooks(query.trim(), limit);
    res.json(books);
  } catch (err) {
    console.error('Open Library search error:', err);
    res.status(500).json({ error: 'Failed to search books from Open Library' });
  }
});

// Get book details from Open Library
router.get('/openlibrary/:key(*)', async (req, res) => {
  try {
    const key = '/' + req.params.key; // Reconstruct the full key path
    const bookDetails = await openLibraryService.getBookDetails(key);
    res.json(bookDetails);
  } catch (err) {
    console.error('Open Library book details error:', err);
    res.status(500).json({ error: 'Failed to get book details from Open Library' });
  }
});

// Search books in local database
router.get('/search', (req, res) => {
  try {
    const query = req.query.q;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters long' });
    }
    
    const books = searchBooks(query.trim());
    res.json(books);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all books with pagination
router.get('/', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    const stmt = db.prepare(`
      SELECT id, title, author, genre, pages, published_year, cover_image_url
      FROM books 
      ORDER BY title
      LIMIT ? OFFSET ?
    `);
    
    const countStmt = db.prepare('SELECT COUNT(*) as total FROM books');
    
    const books = stmt.all(limit, offset);
    const { total } = countStmt.get();
    
    res.json({
      books,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Get books error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get book details by ID
router.get('/:id', (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    
    const stmt = db.prepare('SELECT * FROM books WHERE id = ?');
    const book = stmt.get(bookId);
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json(book);
  } catch (err) {
    console.error('Get book error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new book
router.post('/', authenticateToken, (req, res) => {
  try {
    const { title, author, isbn, description, genre, pages, published_year, cover_image_url } = req.body;
    
    if (!title || !author) {
      return res.status(400).json({ error: 'Title and author are required' });
    }
    
    const stmt = db.prepare(`
      INSERT INTO books (title, author, isbn, description, genre, pages, published_year, cover_image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(title, author, isbn, description, genre, pages, published_year, cover_image_url);
    
    res.status(201).json({ 
      id: result.lastInsertRowid,
      message: 'Book added successfully' 
    });
  } catch (err) {
    console.error('Add book error:', err);
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Book with this ISBN already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's books
router.get('/user/library', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const status = req.query.status;
    
    let whereClause = 'WHERE ub.user_id = ?';
    const params = [userId];
    
    if (status) {
      whereClause += ' AND ub.status = ?';
      params.push(status);
    }
    
    const stmt = db.prepare(`
      SELECT 
        ub.*,
        b.title,
        b.author,
        b.isbn,
        b.description,
        b.genre,
        b.pages,
        b.published_year,
        b.cover_image_url
      FROM user_books ub
      JOIN books b ON ub.book_id = b.id
      ${whereClause}
      ORDER BY ub.updated_at DESC
    `);
    
    const books = stmt.all(...params);
    res.json(books);
  } catch (err) {
    console.error('Get user books error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add book to user's library
router.post('/user/library', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const { book_id, status, rating, review, notes, date_started, date_finished } = req.body;
    
    if (!book_id || !status) {
      return res.status(400).json({ error: 'Book ID and status are required' });
    }
    
    const validStatuses = ['want-to-read', 'currently-reading', 'completed', 'dnf'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO user_books 
      (user_id, book_id, status, rating, review, notes, date_started, date_finished, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);
    
    stmt.run(userId, book_id, status, rating, review, notes, date_started, date_finished);
    
    res.status(201).json({ message: 'Book added to library successfully' });
  } catch (err) {
    console.error('Add to library error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update book in user's library
router.put('/user/library/:userBookId', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const userBookId = parseInt(req.params.userBookId);
    const { status, rating, review, notes, current_page, date_started, date_finished } = req.body;
    
    // Verify the user owns this book record
    const checkStmt = db.prepare('SELECT id FROM user_books WHERE id = ? AND user_id = ?');
    const userBook = checkStmt.get(userBookId, userId);
    
    if (!userBook) {
      return res.status(404).json({ error: 'Book not found in your library' });
    }
    
    const updateStmt = db.prepare(`
      UPDATE user_books 
      SET status = COALESCE(?, status),
          rating = COALESCE(?, rating),
          review = COALESCE(?, review),
          notes = COALESCE(?, notes),
          current_page = COALESCE(?, current_page),
          date_started = COALESCE(?, date_started),
          date_finished = COALESCE(?, date_finished),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    updateStmt.run(status, rating, review, notes, current_page, date_started, date_finished, userBookId);
    
    res.json({ message: 'Book updated successfully' });
  } catch (err) {
    console.error('Update book error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove book from user's library
router.delete('/user/library/:userBookId', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const userBookId = parseInt(req.params.userBookId);
    
    const stmt = db.prepare('DELETE FROM user_books WHERE id = ? AND user_id = ?');
    const result = stmt.run(userBookId, userId);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Book not found in your library' });
    }
    
    res.json({ message: 'Book removed from library successfully' });
  } catch (err) {
    console.error('Remove book error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add reading session
router.post('/user/reading-sessions', authenticateToken, (req, res) => {
  try {
    const { user_book_id, start_page, end_page, session_date, duration_minutes, notes } = req.body;
    
    if (!user_book_id || start_page === undefined || end_page === undefined) {
      return res.status(400).json({ error: 'User book ID, start page, and end page are required' });
    }
    
    if (end_page <= start_page) {
      return res.status(400).json({ error: 'End page must be greater than start page' });
    }
    
    // Verify the user owns this book
    const userId = req.user.id;
    const checkStmt = db.prepare('SELECT id FROM user_books WHERE id = ? AND user_id = ?');
    const userBook = checkStmt.get(user_book_id, userId);
    
    if (!userBook) {
      return res.status(404).json({ error: 'Book not found in your library' });
    }
    
    const stmt = db.prepare(`
      INSERT INTO reading_sessions (user_book_id, start_page, end_page, session_date, duration_minutes, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      user_book_id, 
      start_page, 
      end_page, 
      session_date || new Date().toISOString().split('T')[0], 
      duration_minutes, 
      notes
    );
    
    // Update current page in user_books
    const updatePageStmt = db.prepare('UPDATE user_books SET current_page = ? WHERE id = ?');
    updatePageStmt.run(end_page, user_book_id);
    
    res.status(201).json({ 
      id: result.lastInsertRowid,
      message: 'Reading session recorded successfully' 
    });
  } catch (err) {
    console.error('Add reading session error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
