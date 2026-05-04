import app from "./app.js";
import { logger } from "./lib/logger.js";

const port = Number(process.env["PORT"] || 8080);

// Only listen if not running in a serverless environment (like Vercel)
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(port, () => {
    logger.info({ port }, "Server listening");
  });
}

export default app;
