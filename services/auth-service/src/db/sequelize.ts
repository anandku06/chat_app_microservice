import { Sequelize } from "sequelize";

import { env } from "@/config/env";
import { logger } from "@/utils/logger";

export const sequelize = new Sequelize(env.AUTH_DB_URL, {
  // specifies the type of database being used.
  dialect: "mysql",
  // controls whether Sequelize should log SQL queries to the console.
  logging:
    env.NODE_ENV === "development"
      ? (msg: unknown) => logger.debug(msg)
      : false,
  // defines default options for model definitions
  define: {
    underscored: true,
    freezeTableName: true,
  },
});

export const connectToDatabase = async () => {
  // attempts to establish a connection to the database using the Sequelize instance
  await sequelize.authenticate();
  logger.info("Database connection established successfully.");
};

export const disconnectFromDatabase = async () => {
  // closes the database connection gracefully.
  await sequelize.close();
  logger.info("Database connection closed successfully.");
};
