const crypto = require("node:crypto");
const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

router.post("/login", (req, res) => {
  const { username = "", password = "" } = req.body || {};
  const configuredUsername = process.env.ADMIN_USERNAME;
  const configuredPassword = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET;

  if (
    !configuredUsername ||
    !configuredPassword ||
    !jwtSecret ||
    configuredPassword === "admin123" ||
    configuredPassword === "change-me" ||
    jwtSecret.length < 32 ||
    jwtSecret === "replace-with-a-long-random-secret"
  ) {
    return res.status(503).json({
      success: false,
      message: "Admin login is not configured securely. Set an admin username, a unique password, and a JWT_SECRET of at least 32 characters.",
    });
  }

  if (!safeEqual(username, configuredUsername) || !safeEqual(password, configuredPassword)) {
    return res.status(401).json({ success: false, message: "Invalid username or password." });
  }

  const token = jwt.sign(
    { sub: configuredUsername, role: "admin" },
    jwtSecret,
    { expiresIn: "8h" },
  );

  return res.json({ success: true, token, admin: { username: configuredUsername } });
});

module.exports = router;
