const express = require('express');
const cors = require('cors');
const { router: authRoutes } = require('./routes/auth');
const booksRoutes = require('./routes/books');
const usersRoutes = require('./routes/users');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/users', usersRoutes);

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Booker API is running' });
});

app.listen(PORT, () => console.log(`📚 Booker server running on port ${PORT}`));