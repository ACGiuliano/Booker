const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/books');
const usersRoutes = require('./routes/users');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/users', usersRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));