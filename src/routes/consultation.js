const express = require("express");
const prisma = require("../db");
const requireAdmin = require("../middleware/require-admin");
const { sendEmails, consultationEmails } = require("../services/email");

const router = express.Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanOptional(value, maxLength) {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  return cleaned ? cleaned.slice(0, maxLength) : null;
}

router.post("/", async (req, res, next) => {
  const body = req.body || {};
  const name = cleanOptional(body.name, 160);
  const email = cleanOptional(body.email, 320);

  if (!name || !email) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Name and email address are required.",
      });
  }
  if (!emailPattern.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Enter a valid email address." });
  }

  try {
    const consultation = await prisma.consultation.create({
      data: {
        name,
        email,
        company: cleanOptional(body.company, 200),
        service: cleanOptional(body.service, 160),
      },
    });

    await sendEmails(consultationEmails(consultation));
    return res.status(201).json({
      success: true,
      message: "Consultation booked successfully!",
      consultationId: consultation.id,
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/", requireAdmin, async (req, res, next) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number.parseInt(req.query.limit, 10) || 20),
  );

  try {
    const [consultations, total] = await Promise.all([
      prisma.consultation.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.consultation.count(),
    ]);

    return res.json({
      success: true,
      consultations,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", requireAdmin, async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Record id is required." });
  }

  try {
    const deleted = await prisma.consultation.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: "Consultation deleted successfully.",
      deleted,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Consultation record not found." });
    }
    return next(error);
  }
});

module.exports = router;
