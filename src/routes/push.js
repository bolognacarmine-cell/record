const express = require("express");
const { z } = require("zod");
const { PushSubscription } = require("../models/PushSubscription");
const { authRequired } = require("../middleware/auth");
const { mongoRequired } = require("../middleware/mongo");
const { validate } = require("../middleware/validate");
const { asyncHandler } = require("../utils/asyncHandler");
const { isPushConfigured, sendPush } = require("../services/push");

function pushRouter({ env }) {
  const router = express.Router();
  const auth = authRequired({ jwtSecret: env.jwtSecret });

  router.get(
    "/public-key",
    (_req, res) => {
      if (!env.vapidPublicKey) return res.status(404).json({ error: "NotConfigured" });
      return res.json({ publicKey: env.vapidPublicKey });
    },
  );

  router.post(
    "/subscribe",
    mongoRequired,
    auth,
    validate({
      body: z.object({
        endpoint: z.string().url(),
        keys: z.object({
          p256dh: z.string().min(1),
          auth: z.string().min(1),
        }),
      }),
    }),
    asyncHandler(async (req, res) => {
      const doc = await PushSubscription.findOneAndUpdate(
        { userId: req.user.id, endpoint: req.body.endpoint },
        { $set: { keys: req.body.keys } },
        { new: true, upsert: true },
      );
      res.status(201).json({ subscription: doc });
    }),
  );

  router.post(
    "/test",
    mongoRequired,
    auth,
    validate({
      body: z
        .object({
          title: z.string().trim().min(1).max(100).default("Test"),
          body: z.string().trim().min(1).max(300).default("Notifica di test"),
        })
        .optional()
        .default({}),
    }),
    asyncHandler(async (req, res) => {
      if (!isPushConfigured(env)) return res.status(501).json({ error: "PushNotConfigured" });

      const subs = await PushSubscription.find({ userId: req.user.id }).lean();
      const payload = { title: req.body.title, body: req.body.body, at: new Date().toISOString() };

      const results = await Promise.allSettled(subs.map((s) => sendPush(s, payload)));
      const ok = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.length - ok;

      res.json({ sent: ok, failed });
    }),
  );

  return router;
}

module.exports = { pushRouter };
