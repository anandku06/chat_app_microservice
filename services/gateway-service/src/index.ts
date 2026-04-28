import { createApp } from "@/app";
import { createServer } from "http";
import { env } from "@/config/env";
import { logger } from "@/utils/logger";

const main = async () => {
  try {
    const app = createApp();
    const server = createServer(app);

    const PORT = env.GATEWAY_PORT;

    server.listen(PORT, () => {
      logger.info(`Gateway service is running on port ${PORT}`);
    });

    // Handle graceful shutdown -> This is important to ensure that the service can clean up resources and close connections properly when it receives a termination signal.
    const shutdown = () => {
      logger.info("Shutting down gateway service...");

      Promise.all([])
        .catch((error) => {
          logger.error({ error }, "Error during shutdown");
        })
        .finally(() => {
          process.exit(0);
        });
    };

    // Listen for termination signals
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    logger.error({ error }, "Failed to start the gateway service");
    process.exit(1);
  }
};

main();
