const mongoose = require("mongoose");

async function connectMongoose({ mongodbUri }) {
  if (!mongodbUri) return { connected: false };
  await mongoose.connect(mongodbUri, { serverSelectionTimeoutMS: 10_000 });
  return { connected: true };
}

function mongoStatus() {
  return mongoose.connection.readyState === 1 ? "connected" : "not_connected";
}

module.exports = { mongoose, connectMongoose, mongoStatus };
