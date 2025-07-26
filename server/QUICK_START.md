# Booker Database Quick Start

## ✅ Database Setup Complete!

Your Booker database has been successfully set up with the following components:

### 📊 Database Schema
- **users** - User accounts with secure authentication
- **books** - Book catalog with sample data
- **user_books** - Personal library tracking
- **reading_goals** - Annual reading targets
- **bookshelves** - Custom book collections
- **reading_sessions** - Detailed reading progress

### 🚀 Server Status
- ✅ Server running on port 5000
- ✅ Database initialized with sample books
- ✅ All API endpoints configured
- ✅ Authentication system ready

### 📚 Sample Data Loaded
The database includes 5 classic books to get you started:
- The Great Gatsby
- To Kill a Mockingbird
- 1984
- Pride and Prejudice
- The Catcher in the Rye

### 🔗 API Endpoints Ready

#### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Sign in
- `GET /api/auth/profile` - Get user profile

#### Books & Library
- `GET /api/books/search?q={query}` - Search books
- `GET /api/books` - Browse all books
- `POST /api/books/user/library` - Add book to library
- `GET /api/books/user/library` - Get your books

#### User Features
- `GET /api/users/dashboard` - Dashboard stats
- `GET /api/users/goals` - Reading goals
- `POST /api/users/bookshelves` - Create bookshelf

## 🎯 Next Steps

### 1. Test User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe", 
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Test Book Search
```bash
curl "http://localhost:5000/api/books/search?q=gatsby"
```

### 3. Frontend Integration
Update your React frontend to use these endpoints:
- Registration form → `/api/auth/register`
- Login form → `/api/auth/login`
- Book search → `/api/books/search`

### 4. Environment Setup
Create a `.env` file in the server directory:
```env
PORT=5000
JWT_SECRET=your-super-secret-key-here
NODE_ENV=development
```

## 🛠️ Development Commands

```bash
# Start server
npm start

# Development mode (auto-restart)
npm run dev

# Reset database (⚠️ deletes all data)
npm run reset-db

# Manual database initialization
npm run init-db
```

## 📱 Frontend Connection

Update your React app's API calls to use the new endpoints. The forms you've created (Login.js, Register.js) are already structured correctly for the API.

Example API integration:
```javascript
// Registration
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});

// Login
const response = await fetch('/api/auth/login', {
  method: 'POST', 
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

Your database is now ready for your book tracking application! 🎉
