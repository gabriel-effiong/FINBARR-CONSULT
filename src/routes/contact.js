const express = require("express");
const prisma = require("../db");
const requireAdmin = require("../middleware/require-admin");
const { sendEmails, contactEmails } = require("../services/email");

const router = express.Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanOptional(value, maxLength) {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  return cleaned ? cleaned.slice(0, maxLength) : null;
}

router.post("/", async (req, res, next) => {
  const body = req.body || {};
  const fullName = cleanOptional(body.fullName, 160);
  const email = cleanOptional(body.email, 320);
  const message = cleanOptional(body.message, 5000);

  if (!fullName || !email || !message) {
    return res.status(400).json({ success: false, message: "Full name, email address, and message are required." });
  }
  if (!emailPattern.test(email)) {
    return res.status(400).json({ success: false, message: "Enter a valid email address." });
  }

  try {
    const contact = await prisma.contactMessage.create({
      data: {
        fullName,
        email,
        message,
        company: cleanOptional(body.company, 200),
        phone: cleanOptional(body.phone, 80),
        service: cleanOptional(body.service, 160),
      },
    });

    await sendEmails(contactEmails(contact));
    return res.status(201).json({
      success: true,
      message: "Thank you for your message! We will contact you soon.",
      contactId: contact.id,
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/", requireAdmin, async (req, res, next) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));

  try {
    const [contacts, total] = await Promise.all([
      prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contactMessage.count(),
    ]);

    return res.json({
      success: true,
      contacts,
      pagination: { total, pages: Math.ceil(total / limit), currentPage: page, limit },
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
