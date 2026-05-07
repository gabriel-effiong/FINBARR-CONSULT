const ContactForm = require('../models/ContactForm');
const { sendEmail } = require('../config/email');
const { validationResult } = require('express-validator');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { fullName, email, company, phone, service, message } = req.body;

    // Create contact form entry in database
    const contact = await ContactForm.create({
      fullName,
      email,
      company,
      phone,
      service,
      message,
    });

    // Send confirmation email to user
    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Thank You for Contacting Us</h2>
        <p>Dear ${fullName},</p>
        <p>We have received your message and appreciate your interest in FINBARR CONSULT LIMITED.</p>
        <p>We will review your inquiry and get back to you within 24 hours.</p>
        <hr>
        <h3>Your Inquiry Details:</h3>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Service Interest:</strong> ${service || 'General Inquiry'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p>Best regards,<br><strong>FINBARR CONSULT LIMITED</strong></p>
        <p style="color: #666; font-size: 12px;">
          Naic House, Plot 9. Bank Layout Udo Udoma Avenue, Uyo, Akwa Ibom State, Nigeria<br>
          Phone: +234 803 815 8668 | Email: info@finbarrconsult.com
        </p>
      </div>
    `;

    await sendEmail(email, 'Thank You - FINBARR CONSULT LIMITED', userEmailHtml);

    // Send notification email to admin
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Service Interest:</strong> ${service || 'General Inquiry'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p>
          <a href="${process.env.FRONTEND_URL}/admin/contacts/${contact._id}" 
             style="background-color: #1e40af; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View in Admin Panel
          </a>
        </p>
      </div>
    `;

    await sendEmail(process.env.ADMIN_EMAIL, 'New Contact Form Submission - FINBARR CONSULT', adminEmailHtml);

    res.status(201).json({
      success: true,
      message: 'Thank you for your message. We will contact you soon!',
      contactId: contact._id,
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting contact form. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Get all contacts (Admin)
// @route   GET /api/contact
// @access  Private/Admin
exports.getAllContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const contacts = await ContactForm.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ContactForm.countDocuments();

    res.status(200).json({
      success: true,
      contacts,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single contact by ID
// @route   GET /api/contact/:id
// @access  Private/Admin
exports.getContactById = async (req, res) => {
  try {
    const contact = await ContactForm.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    // Mark as read
    contact.isRead = true;
    await contact.save();

    res.status(200).json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update contact status/notes
// @route   PUT /api/contact/:id
// @access  Private/Admin
exports.updateContact = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const contact = await ContactForm.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.status(200).json({ success: true, message: 'Contact updated', contact });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete contact
// @route   DELETE /api/contact/:id
// @access  Private/Admin
exports.deleteContact = async (req, res) => {
  try {
    const contact = await ContactForm.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.status(200).json({ success: true, message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get contact statistics
// @route   GET /api/contact/stats
// @access  Private/Admin
exports.getContactStats = async (req, res) => {
  try {
    const total = await ContactForm.countDocuments();
    const unread = await ContactForm.countDocuments({ isRead: false });
    const byService = await ContactForm.aggregate([
      { $group: { _id: '$service', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalContacts: total,
        unreadContacts: unread,
        byService,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
