const express = require('express');
const { body } = require('express-validator');
const {
  submitContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
  getContactStats,
} = require('../controllers/contactController');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const contactValidation = [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').notEmpty().withMessage('Message is required'),
];

// Public routes
router.post('/', contactValidation, submitContact);

// Admin routes
router.get('/stats', adminAuth, getContactStats);
router.get('/', adminAuth, getAllContacts);
router.get('/:id', adminAuth, getContactById);
router.put('/:id', adminAuth, updateContact);
router.delete('/:id', adminAuth, deleteContact);

module.exports = router;
