function validate({ body, params, query }) {
  return (req, res, next) => {
    try {
      if (body) req.body = body.parse(req.body);
      if (params) req.params = params.parse(req.params);
      if (query) req.query = query.parse(req.query);
      return next();
    } catch (err) {
      return res
        .status(400)
        .json({ error: "ValidationError", details: err.issues ?? err.errors ?? err.message });
    }
  };
}

module.exports = { validate };
