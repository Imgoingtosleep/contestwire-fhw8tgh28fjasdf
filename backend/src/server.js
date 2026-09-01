const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { initDB, pool } = require("./config/db");
const contestRoutes = require("./routes/contest.routes");
const uploadRoutes = require("./routes/upload.routes");

const app = express();
const PORT = process.env.PORT || 9100;

// CORS setup (supports comma-separated origins from .env)
const allowedOrigins = (process.env.CORS_ORIGIN || "*")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev/staging, adjust if strict needed
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.get("/api/health", async (req, res) => {
  try {
    const dbRes = await pool.query("SELECT NOW();");
    res.json({
      status: "ok",
      service: "news-contest-backend",
      database: "PostgreSQL connected",
      dbTime: dbRes.rows[0].now,
      r2Configured: Boolean(
        process.env.R2_ACCOUNT_ID &&
          process.env.R2_ACCESS_KEY_ID &&
          process.env.R2_SECRET_ACCESS_KEY &&
          process.env.R2_BUCKET_NAME
      ),
    });
  } catch (err) {
    res.status(500).json({
      status: "degraded",
      service: "news-contest-backend",
      database: "Error: " + err.message,
    });
  }
});

app.use("/api/contest", contestRoutes);
app.use("/api/upload", uploadRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("[Unhandled Error]", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Start Server
async function startServer() {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`[Server] Running on port ${PORT} (Node: ${process.version})`);
    });
  } catch (err) {
    console.error("[Fatal] Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
