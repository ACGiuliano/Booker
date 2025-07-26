const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Create or connect to the database
const db = new Database('booker.db');

// Function to initialize the database with schema
function initializeDatabase() {
  try {
    // Read and execute the schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split the schema by semicolons and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);
    
    statements.forEach(statement => {
      try {
        db.exec(statement);
      } catch (err) {
        console.error('Error executing statement:', statement.substring(0, 50) + '...');
        console.error(err.message);
      }
    });
    
    console.log('✅ Database initialized successfully');
  } catch (err) {
    console.error('❌ Error initializing database:', err.message);
    throw err;
  }
}

// Function to get user statistics
function getUserStats(userId) {
  const stmt = db.prepare(`
    SELECT 
      COUNT(CASE WHEN status = 'completed' THEN 1 END) as books_completed,
      COUNT(CASE WHEN status = 'currently-reading' THEN 1 END) as books_reading,
      COUNT(CASE WHEN status = 'want-to-read' THEN 1 END) as books_want_to_read,
      COALESCE(SUM(CASE WHEN status = 'completed' AND b.pages IS NOT NULL THEN b.pages END), 0) as total_pages_read,
      COALESCE(AVG(CASE WHEN rating IS NOT NULL THEN rating END), 0) as average_rating
    FROM user_books ub
    LEFT JOIN books b ON ub.book_id = b.id
    WHERE ub.user_id = ?
  `);
  
  return stmt.get(userId);
}

// Function to get reading progress for current year
function getYearlyProgress(userId, year = new Date().getFullYear()) {
  const goalStmt = db.prepare(`
    SELECT books_target, books_completed, pages_target, pages_completed
    FROM reading_goals 
    WHERE user_id = ? AND year = ?
  `);
  
  const actualStmt = db.prepare(`
    SELECT 
      COUNT(*) as actual_books_completed,
      COALESCE(SUM(b.pages), 0) as actual_pages_read
    FROM user_books ub
    LEFT JOIN books b ON ub.book_id = b.id
    WHERE ub.user_id = ? 
      AND ub.status = 'completed' 
      AND strftime('%Y', ub.date_finished) = ?
  `);
  
  const goal = goalStmt.get(userId, year) || { books_target: 0, books_completed: 0, pages_target: 0, pages_completed: 0 };
  const actual = actualStmt.get(userId, year.toString()) || { actual_books_completed: 0, actual_pages_read: 0 };
  
  return {
    ...goal,
    ...actual
  };
}

// Function to get recent reading activity
function getRecentActivity(userId, limit = 10) {
  const stmt = db.prepare(`
    SELECT 
      b.title,
      b.author,
      ub.status,
      ub.date_started,
      ub.date_finished,
      ub.rating,
      ub.updated_at
    FROM user_books ub
    JOIN books b ON ub.book_id = b.id
    WHERE ub.user_id = ?
    ORDER BY ub.updated_at DESC
    LIMIT ?
  `);
  
  return stmt.all(userId, limit);
}

// Function to search books
function searchBooks(query, limit = 20) {
  const stmt = db.prepare(`
    SELECT id, title, author, genre, pages, published_year, cover_image_url
    FROM books 
    WHERE title LIKE ? OR author LIKE ?
    ORDER BY title
    LIMIT ?
  `);
  
  const searchTerm = `%${query}%`;
  return stmt.all(searchTerm, searchTerm, limit);
}

// Initialize database on module load
initializeDatabase();

// Export database instance and helper functions
module.exports = {
  db,
  getUserStats,
  getYearlyProgress,
  getRecentActivity,
  searchBooks,
  initializeDatabase
};