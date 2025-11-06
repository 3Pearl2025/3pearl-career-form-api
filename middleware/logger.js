import Log from "../models/Log.js";

export const requestLogger = async (req, res, next) => {
  const start = Date.now();

  res.on("finish", async () => {
    try {
      const duration = Date.now() - start;
      const log = new Log({
        ip:
          req.ip ||
          req.headers["x-forwarded-for"] ||
          req.connection.remoteAddress,
        method: req.method,
        endpoint: req.originalUrl,
        statusCode: res.statusCode,
        userAgent: req.headers["user-agent"],
        duration,
      });
      await log.save();
    } catch (err) {
      console.error("❌ Error saving log:", err.message);
    }
  });

  next();
};
