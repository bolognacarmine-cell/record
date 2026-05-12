const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const { mongoStatus } = require("./db/mongoose");
const { authRouter } = require("./routes/auth");
const { remindersRouter } = require("./routes/reminders");
const { audioRouter } = require("./routes/audio");
const { pushRouter } = require("./routes/push");
const { errorHandler } = require("./middleware/error");
const { mongoRequired } = require("./middleware/mongo");

function createApp({ env }) {
  const app = express();

  app.disable("x-powered-by");
  if (env.trustProxy) app.set("trust proxy", 1);

  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigin ? env.corsOrigin.split(",").map((s) => s.trim()) : true,
    }),
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      limit: 300,
      standardHeaders: "draft-7",
      legacyHeaders: false,
    }),
  );

  app.get("/", (_req, res) => {
    res.json({
      ok: true,
      name: "agenda-vocale-backend",
      endpoints: ["/api/health", "/api/auth/*", "/api/reminders/*", "/api/audio/*", "/api/push/*"],
    });
  });

  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      env: env.nodeEnv,
      mongo: mongoStatus(),
    });
  });

  app.use("/api/auth", mongoRequired, authRouter({ env }));
  app.use("/api/reminders", mongoRequired, remindersRouter({ env }));
  app.use("/api", audioRouter({ env }));
  app.use("/api/push", pushRouter({ env }));

  app.use((_req, res) => {
    res.status(404).json({ error: "NotFound" });
  });

  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
