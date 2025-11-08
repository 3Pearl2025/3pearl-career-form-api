import Log from "../models/Log.js";

export const requestLogger = async (req, res, next) => {
  const start = Date.now();

  res.on("finish", async () => {
    try {
      const duration = Date.now() - start;
      const ip =
        req.ip ||
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress;

      const logData = {
        ip,
        method: req.method,
        endpoint: req.originalUrl,
        statusCode: res.statusCode,
        userAgent: req.headers["user-agent"],
        duration,
      };

      // ✅ Print log in console
      console.log(
        `📦 [${new Date().toISOString()}] ${logData.method} ${
          logData.endpoint
        } - ${logData.statusCode} (${logData.duration}ms) - ${logData.ip}`
      );

      // ✅ Save log to MongoDB
      const log = new Log(logData);
      await log.save();
    } catch (err) {
      console.error("❌ Error saving log:", err.message);
    }
  });

  next();
};
