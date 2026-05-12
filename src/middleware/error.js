function errorHandler(err, _req, res, _next) {
  if (res.headersSent) return;
  if (err?.code === 11000) {
    return res.status(409).json({ error: "Conflict" });
  }
  const status = typeof err?.status === "number" ? err.status : 500;
  res.status(status).json({
    error: err?.name || "InternalServerError",
    message: status >= 500 ? "Internal Server Error" : err?.message,
  });
}

module.exports = { errorHandler };
