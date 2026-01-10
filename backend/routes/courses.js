import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../models/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get course categories - MUST be before /:id to avoid matching "meta" as an ID
router.get('/meta/categories', (req, res) => {
  try {
    const categories = db.prepare('SELECT DISTINCT category FROM courses WHERE category IS NOT NULL').all();
    res.json(categories.map(c => c.category));
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all courses
router.get('/', (req, res) => {
  try {
    const { category, level, featured } = req.query;
    let query = 'SELECT * FROM courses WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (level) {
      query += ' AND skill_level = ?';
      params.push(level);
    }

    if (featured === 'true') {
      query += ' AND featured = 1';
    }

    query += ' ORDER BY created_at DESC';

    const courses = db.prepare(query).all(...params);
    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single course with modules
router.get('/:id', (req, res) => {
  try {
    const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const modules = db.prepare('SELECT * FROM modules WHERE course_id = ? ORDER BY order_index').all(req.params.id);
    const reviews = db.prepare(`
      SELECT r.*, u.name as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.course_id = ?
      ORDER BY r.created_at DESC
      LIMIT 5
    `).all(req.params.id);

    res.json({ ...course, modules, reviews });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Enroll in a course
router.post('/:id/enroll', authenticateToken, (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;

    // Check if course exists
    const course = db.prepare('SELECT id FROM courses WHERE id = ?').get(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if already enrolled
    const existing = db.prepare('SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?').get(userId, courseId);
    if (existing) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Create enrollment
    const enrollmentId = uuidv4();
    db.prepare('INSERT INTO enrollments (id, user_id, course_id) VALUES (?, ?, ?)').run(
      enrollmentId, userId, courseId
    );

    res.status(201).json({ message: 'Enrolled successfully', enrollmentId });
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update course progress
router.put('/:id/progress', authenticateToken, (req, res) => {
  try {
    const { progress } = req.body;
    const courseId = req.params.id;
    const userId = req.user.id;

    const enrollment = db.prepare('SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?').get(userId, courseId);
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    const completed = progress >= 100 ? 1 : 0;
    const completedAt = completed ? new Date().toISOString() : null;

    db.prepare(`
      UPDATE enrollments
      SET progress = ?, completed = ?, completed_at = COALESCE(?, completed_at)
      WHERE user_id = ? AND course_id = ?
    `).run(progress, completed, completedAt, userId, courseId);

    res.json({ progress, completed: Boolean(completed) });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
