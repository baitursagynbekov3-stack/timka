import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../models/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Generate certificate number
function generateCertificateNumber() {
  const prefix = 'CERT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// Get user's certificates
router.get('/', authenticateToken, (req, res) => {
  try {
    const certificates = db.prepare(`
      SELECT cert.*, c.title as course_title, c.instructor, u.name as user_name
      FROM certificates cert
      JOIN courses c ON cert.course_id = c.id
      JOIN users u ON cert.user_id = u.id
      WHERE cert.user_id = ?
      ORDER BY cert.issued_at DESC
    `).all(req.user.id);

    res.json(certificates);
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single certificate (public)
router.get('/:id', (req, res) => {
  try {
    const certificate = db.prepare(`
      SELECT cert.*, c.title as course_title, c.instructor, c.duration, u.name as user_name
      FROM certificates cert
      JOIN courses c ON cert.course_id = c.id
      JOIN users u ON cert.user_id = u.id
      WHERE cert.id = ? OR cert.certificate_number = ?
    `).get(req.params.id, req.params.id);

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.json(certificate);
  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Generate certificate after course completion
router.post('/generate', authenticateToken, (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    // Check if course is completed
    const enrollment = db.prepare(`
      SELECT * FROM enrollments
      WHERE user_id = ? AND course_id = ? AND completed = 1
    `).get(userId, courseId);

    if (!enrollment) {
      return res.status(400).json({ error: 'Course must be completed to generate certificate' });
    }

    // Check if certificate already exists
    const existingCert = db.prepare('SELECT * FROM certificates WHERE user_id = ? AND course_id = ?').get(userId, courseId);
    if (existingCert) {
      return res.json(existingCert);
    }

    // Generate certificate
    const certId = uuidv4();
    const certNumber = generateCertificateNumber();

    db.prepare(`
      INSERT INTO certificates (id, user_id, course_id, certificate_number)
      VALUES (?, ?, ?, ?)
    `).run(certId, userId, courseId, certNumber);

    const certificate = db.prepare(`
      SELECT cert.*, c.title as course_title, c.instructor, u.name as user_name
      FROM certificates cert
      JOIN courses c ON cert.course_id = c.id
      JOIN users u ON cert.user_id = u.id
      WHERE cert.id = ?
    `).get(certId);

    res.status(201).json(certificate);
  } catch (error) {
    console.error('Generate certificate error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify certificate (public)
router.get('/verify/:number', (req, res) => {
  try {
    const certificate = db.prepare(`
      SELECT cert.*, c.title as course_title, c.instructor, u.name as user_name
      FROM certificates cert
      JOIN courses c ON cert.course_id = c.id
      JOIN users u ON cert.user_id = u.id
      WHERE cert.certificate_number = ?
    `).get(req.params.number);

    if (!certificate) {
      return res.status(404).json({ valid: false, error: 'Certificate not found' });
    }

    res.json({ valid: true, certificate });
  } catch (error) {
    console.error('Verify certificate error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
