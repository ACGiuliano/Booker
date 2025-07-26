const express = require('express');
const router = express.Router();
const { db, getUserStats, getYearlyProgress, getRecentActivity } = require('../db');
const { authenticateToken } = require('./auth');

// Get user dashboard data
router.get('/dashboard', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user statistics
    const stats = getUserStats(userId);
    
    // Get yearly progress
    const yearlyProgress = getYearlyProgress(userId);
    
    // Get recent activity
    const recentActivity = getRecentActivity(userId, 5);
    
    res.json({
      stats,
      yearlyProgress,
      recentActivity
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's reading goals
router.get('/goals', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const year = req.query.year || new Date().getFullYear();
    
    const stmt = db.prepare(`
      SELECT * FROM reading_goals 
      WHERE user_id = ? AND year = ?
    `);
    
    let goal = stmt.get(userId, year);
    
    // If no goal exists for the year, create a default one
    if (!goal) {
      const insertStmt = db.prepare(`
        INSERT INTO reading_goals (user_id, year, books_target) 
        VALUES (?, ?, ?)
      `);
      const result = insertStmt.run(userId, year, 12);
      goal = { id: result.lastInsertRowid, user_id: userId, year, books_target: 12, books_completed: 0, pages_target: null, pages_completed: 0 };
    }
    
    res.json(goal);
  } catch (err) {
    console.error('Goals error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user's reading goals
router.put('/goals', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const { year, books_target, pages_target } = req.body;
    
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO reading_goals (user_id, year, books_target, pages_target, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);
    
    stmt.run(userId, year || new Date().getFullYear(), books_target, pages_target);
    
    res.json({ message: 'Goals updated successfully' });
  } catch (err) {
    console.error('Update goals error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's bookshelves
router.get('/bookshelves', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    
    const stmt = db.prepare(`
      SELECT 
        bs.*,
        COUNT(bb.id) as book_count
      FROM bookshelves bs
      LEFT JOIN bookshelf_books bb ON bs.id = bb.bookshelf_id
      WHERE bs.user_id = ?
      GROUP BY bs.id
      ORDER BY bs.created_at DESC
    `);
    
    const bookshelves = stmt.all(userId);
    res.json(bookshelves);
  } catch (err) {
    console.error('Bookshelves error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new bookshelf
router.post('/bookshelves', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, is_public } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Bookshelf name is required' });
    }
    
    const stmt = db.prepare(`
      INSERT INTO bookshelves (user_id, name, description, is_public)
      VALUES (?, ?, ?, ?)
    `);
    
    const result = stmt.run(userId, name.trim(), description || '', is_public || false);
    
    res.status(201).json({ 
      id: result.lastInsertRowid,
      message: 'Bookshelf created successfully' 
    });
  } catch (err) {
    console.error('Create bookshelf error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user activity history
router.get('/activity', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;
    
    const activity = getRecentActivity(userId, limit);
    res.json(activity);
  } catch (err) {
    console.error('Activity error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
