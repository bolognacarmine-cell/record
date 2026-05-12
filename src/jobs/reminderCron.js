const cron = require("node-cron");
const { Reminder } = require("../models/Reminder");
const { PushSubscription } = require("../models/PushSubscription");
const { isPushConfigured, sendPush } = require("../services/push");

function startReminderCron({ env }) {
  if (!isPushConfigured(env)) return null;

  const task = cron.schedule("* * * * *", async () => {
    const now = new Date();

    const reminders = await Reminder.find({
      done: false,
      notifiedAt: { $exists: false },
      dueAt: { $lte: now },
    })
      .sort({ dueAt: 1 })
      .limit(200);

    if (reminders.length === 0) return;

    const byUser = new Map();
    for (const r of reminders) {
      const key = String(r.userId);
      const list = byUser.get(key) || [];
      list.push(r);
      byUser.set(key, list);
    }

    for (const [userId, list] of byUser.entries()) {
      const subs = await PushSubscription.find({ userId }).lean();
      if (subs.length === 0) {
        await Reminder.updateMany(
          { _id: { $in: list.map((r) => r._id) } },
          { $set: { notifiedAt: now } },
        );
        continue;
      }

      const first = list[0];
      const payload = {
        title: list.length === 1 ? "Promemoria" : `Promemoria (${list.length})`,
        body: list.length === 1 ? first.title : `${first.title} + altri`,
        dueAt: first.dueAt.toISOString(),
      };

      const results = await Promise.allSettled(subs.map((s) => sendPush(s, payload)));

      const toDelete = [];
      for (let i = 0; i < results.length; i++) {
        const r = results[i];
        if (r.status === "rejected") {
          const statusCode = r.reason?.statusCode || r.reason?.status;
          if (statusCode === 404 || statusCode === 410) {
            toDelete.push(subs[i].endpoint);
          }
        }
      }

      if (toDelete.length) {
        await PushSubscription.deleteMany({ userId, endpoint: { $in: toDelete } });
      }

      await Reminder.updateMany(
        { _id: { $in: list.map((r) => r._id) } },
        { $set: { notifiedAt: now } },
      );
    }
  });

  return () => task.stop();
}

module.exports = { startReminderCron };
