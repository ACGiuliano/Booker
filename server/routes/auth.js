const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../db');

const SECRET = process.env.JWT_SECRET || 'supersecret';

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ 
        error: 'All fields are required',
        details: {
          firstName: !firstName ? 'First name is required' : null,
          lastName: !lastName ? 'Last name is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Insert user into database
    const stmt = db.prepare(`
      INSERT INTO users (first_name, last_name, email, password) 
      VALUES (?, ?, ?, ?)
    `);
    
    const result = stmt.run(firstName, lastName, email.toLowerCase(), hashedPassword);
    
    // Create a reading goal for current year
    const currentYear = new Date().getFullYear();
    const goalStmt = db.prepare(`
      INSERT INTO reading_goals (user_id, year, books_target) 
      VALUES (?, ?, ?)
    `);
    goalStmt.run(result.lastInsertRowid, currentYear, 12); // Default goal of 12 books per year

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: result.lastInsertRowid, 
        email: email.toLowerCase(),
        firstName,
        lastName 
      }, 
      SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      message: 'User created successfully',
      token,
      user: {
        id: result.lastInsertRowid,
        firstName,
        lastName,
        email: email.toLowerCase()
      }
    });
    
  } catch (err) {
    console.error('Registration error:', err);
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email.toLowerCase());

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name 
      }, 
      SECRET,
      { expiresIn: '7d' }
    );

    res.json({ 
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email
      }
    });
    
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Get current user profile
router.get('/profile', authenticateToken, (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT id, first_name, last_name, email, created_at 
      FROM users 
      WHERE id = ?
    `);
    const user = stmt.get(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      createdAt: user.created_at
    });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = { router, authenticateToken };