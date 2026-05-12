const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    text: { type: String, trim: true },
    dueAt: { type: Date, required: true, index: true },
    done: { type: Boolean, default: false },
    notifiedAt: { type: Date },
    audioFileId: { type: mongoose.Schema.Types.ObjectId },
    audioContentType: { type: String },
    audioFilename: { type: String },
  },
  { timestamps: true },
);

reminderSchema.index({ userId: 1, dueAt: 1 });

const Reminder = mongoose.model("Reminder", reminderSchema);

module.exports = { Reminder };
