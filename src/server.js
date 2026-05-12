const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim()) : true,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 300,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  }),
);

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    env: process.env.NODE_ENV || "development",
    mongo: mongoose.connection.readyState === 1 ? "connected" : "not_connected",
  });
});

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

function start() {
  const port = Number(process.env.PORT) || 4000;
  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri) {
    mongoose
      .connect(mongoUri, { serverSelectionTimeoutMS: 10_000 })
      .catch(() => {});
  }

  const server = app.listen(port, () => {
    process.stdout.write(`Listening on :${port}\n`);
  });

  const shutdown = async () => {
    server.close(() => {});
    try {
      await mongoose.connection.close(false);
    } catch {}
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start();
