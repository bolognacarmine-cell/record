const { env } = require("./config/env");
const { mongoose, connectMongoose } = require("./db/mongoose");
const { createApp } = require("./app");
const { configurePush } = require("./services/push");
const { startReminderCron } = require("./jobs/reminderCron");

async function start() {
  if (!env.jwtSecret) {
    throw new Error("JWT_SECRET is required");
  }
  if (env.nodeEnv === "production" && !env.mongodbUri) {
    throw new Error("MONGODB_URI is required in production");
  }

  try {
    await connectMongoose({ mongodbUri: env.mongodbUri });
  } catch (err) {
    if (env.nodeEnv === "production") throw err;
  }

  configurePush(env);

  const app = createApp({ env });
  const server = app.listen(env.port, "0.0.0.0", () => {
    process.stdout.write(`Listening on :${env.port}\n`);
  });

  const stopCron = startReminderCron({ env });

  const shutdown = async () => {
    if (stopCron) stopCron();
    server.close(() => {});
    try {
      await mongoose.connection.close(false);
    } catch {}
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start().catch((err) => {
  process.stderr.write(`${err?.message || err}\n`);
  process.exit(1);
});
