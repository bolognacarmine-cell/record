const { mongoStatus } = require("../db/mongoose");

function mongoRequired(req, res, next) {
  if (mongoStatus() !== "connected") {
    return res.status(503).json({ error: "MongoNotConnected" });
  }
  return next();
}

module.exports = { mongoRequired };
