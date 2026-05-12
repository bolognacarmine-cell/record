const express = require("express");
const { z } = require("zod");
const mongoose = require("mongoose");
const { Reminder } = require("../models/Reminder");
const { authRequired } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { asyncHandler } = require("../utils/asyncHandler");

function remindersRouter({ env }) {
  const router = express.Router();
  const auth = authRequired({ jwtSecret: env.jwtSecret });

  const dateFromIso = z
    .string()
    .datetime()
    .transform((v) => new Date(v));

  router.get(
    "/",
    auth,
    validate({
      query: z
        .object({
          from: z.string().datetime().optional(),
          to: z.string().datetime().optional(),
          done: z.enum(["true", "false"]).optional(),
        })
        .optional()
        .default({}),
    }),
    asyncHandler(async (req, res) => {
      const q = { userId: req.user.id };
      if (req.query.done) q.done = req.query.done === "true";
      if (req.query.from || req.query.to) {
        q.dueAt = {};
        if (req.query.from) q.dueAt.$gte = new Date(req.query.from);
        if (req.query.to) q.dueAt.$lte = new Date(req.query.to);
      }

      const reminders = await Reminder.find(q).sort({ dueAt: 1, createdAt: -1 }).limit(500);
      res.json({ reminders });
    }),
  );

  router.post(
    "/",
    auth,
    validate({
      body: z.object({
        title: z.string().trim().min(1).max(200),
        text: z.string().trim().max(10_000).optional(),
        dueAt: dateFromIso,
      }),
    }),
    asyncHandler(async (req, res) => {
      const reminder = await Reminder.create({
        userId: new mongoose.Types.ObjectId(req.user.id),
        title: req.body.title,
        text: req.body.text,
        dueAt: req.body.dueAt,
      });
      res.status(201).json({ reminder });
    }),
  );

  router.get(
    "/:id",
    auth,
    validate({
      params: z.object({ id: z.string().min(1) }),
    }),
    asyncHandler(async (req, res) => {
      const reminder = await Reminder.findOne({ _id: req.params.id, userId: req.user.id });
      if (!reminder) return res.status(404).json({ error: "NotFound" });
      return res.json({ reminder });
    }),
  );

  router.patch(
    "/:id",
    auth,
    validate({
      params: z.object({ id: z.string().min(1) }),
      body: z
        .object({
          title: z.string().trim().min(1).max(200).optional(),
          text: z.string().trim().max(10_000).optional(),
          dueAt: dateFromIso.optional(),
          done: z.boolean().optional(),
        })
        .refine((b) => Object.keys(b).length > 0, { message: "Empty patch" }),
    }),
    asyncHandler(async (req, res) => {
      const reminder = await Reminder.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { $set: req.body },
        { new: true },
      );
      if (!reminder) return res.status(404).json({ error: "NotFound" });
      return res.json({ reminder });
    }),
  );

  router.delete(
    "/:id",
    auth,
    validate({
      params: z.object({ id: z.string().min(1) }),
    }),
    asyncHandler(async (req, res) => {
      const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
      if (!reminder) return res.status(404).json({ error: "NotFound" });
      return res.status(204).end();
    }),
  );

  return router;
}

module.exports = { remindersRouter };
