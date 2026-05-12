const express = require("express");
const multer = require("multer");
const { z } = require("zod");
const { Reminder } = require("../models/Reminder");
const { authRequired } = require("../middleware/auth");
const { mongoRequired } = require("../middleware/mongo");
const { validate } = require("../middleware/validate");
const { asyncHandler } = require("../utils/asyncHandler");
const { uploadBuffer, openDownloadStream, deleteFile } = require("../services/gridfs");

function audioRouter({ env }) {
  const router = express.Router();
  const auth = authRequired({ jwtSecret: env.jwtSecret });

  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 25 * 1024 * 1024 },
  });

  router.post(
    "/reminders/:id/audio",
    mongoRequired,
    auth,
    validate({ params: z.object({ id: z.string().min(1) }) }),
    upload.single("audio"),
    asyncHandler(async (req, res) => {
      if (!req.file) return res.status(400).json({ error: "MissingFile" });

      const reminder = await Reminder.findOne({ _id: req.params.id, userId: req.user.id });
      if (!reminder) return res.status(404).json({ error: "NotFound" });

      const previousFileId = reminder.audioFileId ? String(reminder.audioFileId) : null;

      const file = await uploadBuffer({
        buffer: req.file.buffer,
        filename: req.file.originalname || "audio",
        contentType: req.file.mimetype,
        metadata: { userId: req.user.id, reminderId: String(reminder._id) },
      });

      reminder.audioFileId = file._id;
      reminder.audioFilename = file.filename;
      reminder.audioContentType = file.contentType;
      await reminder.save();

      if (previousFileId) {
        deleteFile(previousFileId).catch(() => {});
      }

      res.status(201).json({ reminder });
    }),
  );

  router.get(
    "/audio/:fileId",
    mongoRequired,
    auth,
    validate({ params: z.object({ fileId: z.string().min(1) }) }),
    asyncHandler(async (req, res) => {
      const reminder = await Reminder.findOne({
        userId: req.user.id,
        audioFileId: req.params.fileId,
      }).select("_id audioFileId audioFilename audioContentType");

      if (!reminder) return res.status(404).json({ error: "NotFound" });

      res.setHeader("Content-Type", reminder.audioContentType || "application/octet-stream");
      const filename = reminder.audioFilename || "audio";
      res.setHeader("Content-Disposition", `inline; filename="${filename.replaceAll('"', "")}"`);

      const stream = openDownloadStream(req.params.fileId);
      stream.on("error", () => {
        if (!res.headersSent) res.status(404).json({ error: "NotFound" });
      });
      stream.pipe(res);
    }),
  );

  return router;
}

module.exports = { audioRouter };
