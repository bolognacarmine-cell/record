require("dotenv").config();

function bool(value) {
  if (value === undefined) return undefined;
  return value === "1" || value === "true" || value === "yes";
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 4000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  corsOrigin: process.env.CORS_ORIGIN,
  vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
  vapidPrivateKey: process.env.VAPID_PRIVATE_KEY,
  pushSubject: process.env.PUSH_SUBJECT || "mailto:admin@example.com",
  trustProxy: bool(process.env.TRUST_PROXY) ?? true,
};

module.exports = { env };
