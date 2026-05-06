import { Sequelize } from "sequelize";

import { env } from "@/config/env";
import { logger } from "@/utils/logger";

export const sequelize = new Sequelize(env.USER_DB_URL, {
  dialect: "postgres",
  logging:
    env.NODE_ENV === "development"
      ? (msg: unknown) => logger.debug(msg)
      : false,
  define: {
    underscored: true,
    freezeTableName: true,
  },
});

export const connectToDatabase = async () => {
  await sequelize.authenticate();
  logger.info("User Database connection established successfully.");
};

export const initializeDatabase = async () => {
  await connectToDatabase();

  // sync the models with the database, this will create the tables if they don't exist, but it won't drop them if they already exist, we set alter to true to update the tables to match the models if there are any changes, but this can cause data loss in some cases, so it's recommended to use migrations for production applications
  const syncOptions = env.NODE_ENV === "production" ? { alter: true } : {};
  await sequelize.sync(syncOptions);
  logger.info("User Database synchronized successfully.");
};

export const disconnectFromDatabase = async () => {
  await sequelize.close();
  logger.info("User Database connection closed successfully.");
};
