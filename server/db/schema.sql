-- Booker Database Schema
-- SQLite database schema for the book tracking application

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Reading goals table
CREATE TABLE IF NOT EXISTS reading_goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    year INTEGER NOT NULL,
    books_target INTEGER NOT NULL,
    books_completed INTEGER DEFAULT 0,
    pages_target INTEGER,
    pages_completed INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, year)
);

-- Books table - stores information about books
CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT UNIQUE,
    description TEXT,
    genre TEXT,
    pages INTEGER,
    published_year INTEGER,
    cover_image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User books table - tracks user's relationship with books
CREATE TABLE IF NOT EXISTS user_books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('want-to-read', 'currently-reading', 'completed', 'dnf')),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    notes TEXT,
    date_started DATE,
    date_finished DATE,
    current_page INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    UNIQUE(user_id, book_id)
);

-- Bookshelves table - custom shelves created by users
CREATE TABLE IF NOT EXISTS bookshelves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bookshelf books table - many-to-many relationship between bookshelves and user_books
CREATE TABLE IF NOT EXISTS bookshelf_books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bookshelf_id INTEGER NOT NULL,
    user_book_id INTEGER NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bookshelf_id) REFERENCES bookshelves(id) ON DELETE CASCADE,
    FOREIGN KEY (user_book_id) REFERENCES user_books(id) ON DELETE CASCADE,
    UNIQUE(bookshelf_id, user_book_id)
);

-- Reading sessions table - track reading sessions and progress
CREATE TABLE IF NOT EXISTS reading_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_book_id INTEGER NOT NULL,
    start_page INTEGER NOT NULL,
    end_page INTEGER NOT NULL,
    pages_read INTEGER GENERATED ALWAYS AS (end_page - start_page) STORED,
    session_date DATE NOT NULL,
    duration_minutes INTEGER,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_book_id) REFERENCES user_books(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_books_user_id ON user_books(user_id);
CREATE INDEX IF NOT EXISTS idx_user_books_book_id ON user_books(book_id);
CREATE INDEX IF NOT EXISTS idx_user_books_status ON user_books(status);
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_reading_goals_user_year ON reading_goals(user_id, year);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_user_book ON reading_sessions(user_book_id);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_date ON reading_sessions(session_date);

-- Insert some sample data
INSERT OR IGNORE INTO books (title, author, isbn, description, genre, pages, published_year) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 'A classic American novel set in the Jazz Age', 'Fiction', 180, 1925),
('To Kill a Mockingbird', 'Harper Lee', '9780060935467', 'A story of racial injustice and childhood in the American South', 'Fiction', 281, 1960),
('1984', 'George Orwell', '9780451524935', 'A dystopian social science fiction novel', 'Science Fiction', 328, 1949),
('Pride and Prejudice', 'Jane Austen', '9780141439518', 'A romantic novel of manners', 'Romance', 279, 1813),
('The Catcher in the Rye', 'J.D. Salinger', '9780316769174', 'A coming-of-age story', 'Fiction', 277, 1951);
