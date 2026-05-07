const express = require('express');
const { body } = require('express-validator');
const {
  submitConsultation,
  getAllConsultations,
  getConsultationById,
  updateConsultation,
  getConsultationStats,
} = require('../controllers/consultationController');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const consultationValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
];

// Public routes
router.post('/', consultationValidation, submitConsultation);

// Admin routes
router.get('/stats', adminAuth, getConsultationStats);
router.get('/', adminAuth, getAllConsultations);
router.get('/:id', adminAuth, getConsultationById);
router.put('/:id', adminAuth, updateConsultation);

module.exports = router;
