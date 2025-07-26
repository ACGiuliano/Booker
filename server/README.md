# Booker Database Setup Guide

This guide will help you set up the database for your Booker book tracking application.

## Database Structure

The Booker application uses SQLite as its database, managed through the `better-sqlite3` package. The database consists of the following main tables:

### Core Tables

1. **users** - User account information
2. **books** - Book catalog with titles, authors, ISBNs, etc.
3. **user_books** - User's personal library (books they own/read)
4. **reading_goals** - Annual reading goals and progress
5. **bookshelves** - Custom user-created book collections
6. **bookshelf_books** - Books assigned to specific bookshelves
7. **reading_sessions** - Individual reading session tracking

## Setup Instructions

### 1. Install Dependencies

Navigate to the server directory and install the required packages:

```bash
cd server
npm install
```

### 2. Environment Configuration

Copy the example environment file and customize it:

```bash
cp .env.example .env
```

Edit the `.env` file with your preferred settings:

```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DB_PATH=booker.db
NODE_ENV=development
```

### 3. Initialize the Database

The database will be automatically initialized when you first run the server. Alternatively, you can manually initialize it:

```bash
npm run init-db
```

### 4. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

## Database Features

### User Management
- Secure user registration and authentication
- Password hashing with bcrypt
- JWT token-based authentication
- User profile management

### Book Tracking
- Add books to personal library
- Track reading status (want-to-read, currently-reading, completed, DNF)
- Rate and review books
- Record reading progress with page numbers
- Track reading sessions with time and notes

### Reading Goals
- Set annual reading goals (books and pages)
- Automatic progress tracking
- Goal achievement monitoring

### Organization
- Create custom bookshelves
- Organize books into collections
- Public/private bookshelf options

### Analytics
- Reading statistics and insights
- Progress tracking and visualization
- Reading history and activity feed

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Books
- `GET /api/books/search?q={query}` - Search books
- `GET /api/books` - Get all books (paginated)
- `GET /api/books/:id` - Get book details
- `POST /api/books` - Add new book
- `GET /api/books/user/library` - Get user's library
- `POST /api/books/user/library` - Add book to library
- `PUT /api/books/user/library/:id` - Update book in library
- `DELETE /api/books/user/library/:id` - Remove book from library

### Users
- `GET /api/users/dashboard` - Get dashboard data
- `GET /api/users/goals` - Get reading goals
- `PUT /api/users/goals` - Update reading goals
- `GET /api/users/bookshelves` - Get user's bookshelves
- `POST /api/users/bookshelves` - Create new bookshelf

## Database Management

### Reset Database
To completely reset the database (⚠️ this will delete all data):

```bash
npm run reset-db
```

### Backup Database
The SQLite database file (`booker.db`) can be backed up by simply copying the file:

```bash
cp booker.db booker-backup-$(date +%Y%m%d).db
```

### Sample Data
The database initialization includes sample books to get you started. You can modify the sample data in `db/schema.sql`.

## Development Notes

### Database Queries
The database layer includes helper functions for common operations:
- `getUserStats(userId)` - Get user's reading statistics
- `getYearlyProgress(userId, year)` - Get reading goal progress
- `getRecentActivity(userId, limit)` - Get recent reading activity
- `searchBooks(query, limit)` - Search books by title/author

### Security Features
- Passwords are hashed using bcrypt with salt rounds of 12
- JWT tokens expire after 7 days
- Email addresses are stored in lowercase for consistency
- SQL injection protection through prepared statements

### Performance Optimizations
- Database indexes on frequently queried columns
- Prepared statements for better performance
- Efficient pagination for large datasets

## Troubleshooting

### Common Issues

1. **Database locked error**
   - Make sure no other processes are accessing the database
   - Restart the server

2. **JWT secret warning**
   - Set a secure JWT_SECRET in your .env file
   - Use a long, random string for production

3. **Permission errors**
   - Ensure the server has write permissions in the directory
   - Check file ownership and permissions

### Database Inspection
You can inspect the database directly using the SQLite CLI:

```bash
sqlite3 booker.db
.tables
.schema users
SELECT * FROM users LIMIT 5;
```

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in your environment
2. Use a strong, unique JWT secret
3. Consider using environment variables for sensitive configuration
4. Set up regular database backups
5. Monitor database size and performance
6. Consider using a more robust database solution for high-scale applications

The SQLite database is perfect for small to medium-scale applications. For larger deployments, consider migrating to PostgreSQL or MySQL.
