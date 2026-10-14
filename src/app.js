require("dotenv").config();

const path = require("node:path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const prisma = require("./db");
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");
const consultationRoutes = require("./routes/consultation");

const app = express();
const projectRoot = path.resolve(__dirname, "..");
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5000,http://127.0.0.1:5000,http://localhost:5500")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable("x-powered-by");
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors((req, callback) => {
  const origin = req.get("origin");
  let sameHost = false;
  if (origin) {
    try {
      sameHost = new URL(origin).host.toLowerCase() === (req.get("host") || "").toLowerCase();
    } catch {
      sameHost = false;
    }
  }
  callback(null, { origin: Boolean(origin && (sameHost || allowedOrigins.includes(origin))) });
}));
app.use(express.json({ limit: "12kb" }));

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many submissions. Please try again later." },
});
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts. Please try again later." },
});

app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.json({ success: true, status: "ok", database: "connected" });
  } catch {
    return res.status(503).json({ success: false, status: "degraded", database: "unavailable" });
  }
});

app.use("/api/auth", loginLimiter, authRoutes);
const limitFormPosts = (req, res, next) =>
  req.method === "POST" ? formLimiter(req, res, next) : next();

app.use("/api/contact", limitFormPosts, contactRoutes);
app.use("/api/consultation", limitFormPosts, consultationRoutes);

app.get("/", (req, res) => res.sendFile(path.join(projectRoot, "index.html")));
app.get(["/admin", "/admin.html"], (req, res) => res.sendFile(path.join(projectRoot, "admin.html")));
app.get("/style.css", (req, res) => res.sendFile(path.join(projectRoot, "style.css")));
app.use("/images", express.static(path.join(projectRoot, "images"), { dotfiles: "deny" }));

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not found." });
});

app.use((error, req, res, next) => {
  console.error("API request failed:", error);
  if (res.headersSent) return next(error);
  if (error.type === "entity.too.large") {
    return res.status(413).json({ success: false, message: "Request body is too large." });
  }
  return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
});

module.exports = app;
