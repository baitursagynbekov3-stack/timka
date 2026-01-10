import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../models/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's enrolled courses
router.get('/enrollments', authenticateToken, (req, res) => {
  try {
    const enrollments = db.prepare(`
      SELECT e.*, c.title, c.description, c.short_description, c.image, c.duration, c.skill_level, c.instructor
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.user_id = ?
      ORDER BY e.enrolled_at DESC
    `).all(req.user.id);

    res.json(enrollments);
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's completed courses
router.get('/completed', authenticateToken, (req, res) => {
  try {
    const completed = db.prepare(`
      SELECT e.*, c.title, c.description, c.image, c.duration, c.instructor
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.user_id = ? AND e.completed = 1
      ORDER BY e.completed_at DESC
    `).all(req.user.id);

    res.json(completed);
  } catch (error) {
    console.error('Get completed courses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, (req, res) => {
  try {
    const { name, avatar } = req.body;
    const userId = req.user.id;

    if (name) {
      db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name, userId);
    }

    if (avatar) {
      db.prepare('UPDATE users SET avatar = ? WHERE id = ?').run(avatar, userId);
    }

    const user = db.prepare('SELECT id, email, name, avatar FROM users WHERE id = ?').get(userId);
    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Change password
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both current and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const user = db.prepare('SELECT password FROM users WHERE id = ?').get(userId);
    const validPassword = await bcrypt.compare(currentPassword, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, userId);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user stats
router.get('/stats', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;

    const totalEnrolled = db.prepare('SELECT COUNT(*) as count FROM enrollments WHERE user_id = ?').get(userId);
    const completed = db.prepare('SELECT COUNT(*) as count FROM enrollments WHERE user_id = ? AND completed = 1').get(userId);
    const inProgress = db.prepare('SELECT COUNT(*) as count FROM enrollments WHERE user_id = ? AND completed = 0').get(userId);
    const certificates = db.prepare('SELECT COUNT(*) as count FROM certificates WHERE user_id = ?').get(userId);

    res.json({
      totalEnrolled: totalEnrolled.count,
      completed: completed.count,
      inProgress: inProgress.count,
      certificates: certificates.count
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
