const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { User } = require("../models/User");
const { authRequired } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { asyncHandler } = require("../utils/asyncHandler");

function authRouter({ env }) {
  const router = express.Router();

  router.post(
    "/register",
    validate({
      body: z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().trim().min(1).max(100).optional(),
      }),
    }),
    asyncHandler(async (req, res) => {
      const { email, password, name } = req.body;
      const passwordHash = await bcrypt.hash(password, 12);

      const user = await User.create({ email, name, passwordHash });

      const token = jwt.sign({ sub: String(user._id) }, env.jwtSecret, { expiresIn: "30d" });
      res.status(201).json({ token });
    }),
  );

  router.post(
    "/login",
    validate({
      body: z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }),
    }),
    asyncHandler(async (req, res) => {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(401).json({ error: "InvalidCredentials" });

      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return res.status(401).json({ error: "InvalidCredentials" });

      const token = jwt.sign({ sub: String(user._id) }, env.jwtSecret, { expiresIn: "30d" });
      return res.json({ token });
    }),
  );

  router.get(
    "/me",
    authRequired({ jwtSecret: env.jwtSecret }),
    asyncHandler(async (req, res) => {
      const user = await User.findById(req.user.id).select("_id email name createdAt updatedAt");
      if (!user) return res.status(404).json({ error: "UserNotFound" });
      return res.json({ user });
    }),
  );

  return router;
}

module.exports = { authRouter };
