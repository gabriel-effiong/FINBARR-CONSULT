const Consultation = require('../models/Consultation');
const { sendEmail } = require('../config/email');
const { validationResult } = require('express-validator');

// @desc    Submit consultation request
// @route   POST /api/consultation
// @access  Public
exports.submitConsultation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, company, service } = req.body;

    // Create consultation request in database
    const consultation = await Consultation.create({
      name,
      email,
      company,
      service,
      status: 'pending',
    });

    // Send confirmation email to client
    const clientEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Consultation Request Received</h2>
        <p>Dear ${name},</p>
        <p>Thank you for scheduling a free consultation with FINBARR CONSULT LIMITED.</p>
        <p>We have received your request and will contact you within 24 hours to confirm the details and find a convenient time for your consultation.</p>
        <hr>
        <h3>Consultation Details:</h3>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Service of Interest:</strong> ${service || 'General Consultation'}</p>
        <hr>
        <p style="color: #666;">
          If you need to reschedule or have any questions, please don't hesitate to contact us.<br>
          Phone: +234 803 815 8668 | Email: info@finbarrconsult.com
        </p>
        <p>Best regards,<br><strong>FINBARR CONSULT LIMITED</strong></p>
      </div>
    `;

    await sendEmail(email, 'Consultation Request Confirmed - FINBARR CONSULT LIMITED', clientEmailHtml);

    // Send notification to admin
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Consultation Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Service Interest:</strong> ${service || 'General'}</p>
        <p><strong>Requested At:</strong> ${new Date().toLocaleString()}</p>
        <hr>
        <p>
          <a href="${process.env.FRONTEND_URL}/admin/consultations/${consultation._id}" 
             style="background-color: #1e40af; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View in Admin Panel
          </a>
        </p>
      </div>
    `;

    await sendEmail(process.env.ADMIN_EMAIL, 'New Consultation Request - FINBARR CONSULT', adminEmailHtml);

    res.status(201).json({
      success: true,
      message: 'Consultation scheduled! We will contact you to confirm.',
      consultationId: consultation._id,
    });
  } catch (error) {
    console.error('Consultation submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error scheduling consultation. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Get all consultation requests (Admin)
// @route   GET /api/consultation
// @access  Private/Admin
exports.getAllConsultations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const consultations = await Consultation.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Consultation.countDocuments();

    res.status(200).json({
      success: true,
      consultations,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single consultation request
// @route   GET /api/consultation/:id
// @access  Private/Admin
exports.getConsultationById = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({ success: false, message: 'Consultation not found' });
    }

    res.status(200).json({ success: true, consultation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update consultation status
// @route   PUT /api/consultation/:id
// @access  Private/Admin
exports.updateConsultation = async (req, res) => {
  try {
    const { status, preferredDate, preferredTime, notes, followUpDate } = req.body;

    const consultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      { status, preferredDate, preferredTime, notes, followUpDate },
      { new: true, runValidators: true }
    );

    if (!consultation) {
      return res.status(404).json({ success: false, message: 'Consultation not found' });
    }

    res.status(200).json({ success: true, message: 'Consultation updated', consultation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get consultation statistics
// @route   GET /api/consultation/stats
// @access  Private/Admin
exports.getConsultationStats = async (req, res) => {
  try {
    const total = await Consultation.countDocuments();
    const pending = await Consultation.countDocuments({ status: 'pending' });
    const scheduled = await Consultation.countDocuments({ status: 'scheduled' });
    const completed = await Consultation.countDocuments({ status: 'completed' });

    res.status(200).json({
      success: true,
      stats: {
        totalRequests: total,
        pending,
        scheduled,
        completed,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
