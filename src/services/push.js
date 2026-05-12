const webpush = require("web-push");

function isPushConfigured(env) {
  return Boolean(env.vapidPublicKey && env.vapidPrivateKey);
}

function configurePush(env) {
  if (!isPushConfigured(env)) return false;
  webpush.setVapidDetails(env.pushSubject, env.vapidPublicKey, env.vapidPrivateKey);
  return true;
}

async function sendPush(subscription, payload) {
  return webpush.sendNotification(subscription, JSON.stringify(payload));
}

module.exports = { isPushConfigured, configurePush, sendPush };
