import { createApp } from "@/app";
import { createServer } from "http";
import { env } from "@/config/env";
import { logger } from "@/utils/logger";
import { connectToDatabase } from "@/db/sequelize";

const main = async () => {
  try {
    await connectToDatabase();

    const app = createApp();
    const server = createServer(app);

    const PORT = env.AUTH_SERVICE_PORT;

    server.listen(PORT, () => {
      logger.info(`Auth service is running on port ${PORT}`);
    });

    // Handle graceful shutdown -> This is important to ensure that the service can clean up resources and close connections properly when it receives a termination signal.
    const shutdown = () => {
      logger.info("Shutting down auth service...");

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
    logger.error({ error }, "Failed to start the auth service");
    process.exit(1);
  }
};

main();
