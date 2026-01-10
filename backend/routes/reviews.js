import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../models/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all reviews (for homepage)
router.get('/', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const reviews = db.prepare(`
      SELECT r.*, u.name as user_name, c.title as course_title
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN courses c ON r.course_id = c.id
      ORDER BY r.created_at DESC
      LIMIT ?
    `).all(limit);

    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get reviews for a specific course
router.get('/course/:courseId', (req, res) => {
  try {
    const reviews = db.prepare(`
      SELECT r.*, u.name as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.course_id = ?
      ORDER BY r.created_at DESC
    `).all(req.params.courseId);

    res.json(reviews);
  } catch (error) {
    console.error('Get course reviews error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a review
router.post('/', authenticateToken, (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!courseId || !rating) {
      return res.status(400).json({ error: 'Course ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if user is enrolled
    const enrollment = db.prepare('SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?').get(userId, courseId);
    if (!enrollment) {
      return res.status(403).json({ error: 'You must be enrolled to review this course' });
    }

    // Check for existing review
    const existingReview = db.prepare('SELECT id FROM reviews WHERE user_id = ? AND course_id = ?').get(userId, courseId);
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this course' });
    }

    const reviewId = uuidv4();
    db.prepare('INSERT INTO reviews (id, user_id, course_id, rating, comment) VALUES (?, ?, ?, ?, ?)').run(
      reviewId, userId, courseId, rating, comment || null
    );

    const review = db.prepare(`
      SELECT r.*, u.name as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
    `).get(reviewId);

    res.status(201).json(review);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a review
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(req.params.id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this review' });
    }

    db.prepare('DELETE FROM reviews WHERE id = ?').run(req.params.id);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
