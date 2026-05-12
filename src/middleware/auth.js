const jwt = require("jsonwebtoken");

function authRequired({ jwtSecret }) {
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is required");
  }

  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = header.slice("Bearer ".length);
    try {
      const payload = jwt.verify(token, jwtSecret);
      req.user = { id: payload.sub };
      return next();
    } catch {
      return res.status(401).json({ error: "Unauthorized" });
    }
  };
}

module.exports = { authRequired };
