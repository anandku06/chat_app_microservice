// This file serves as the main entry point for the models in the authentication service. It imports and initializes the Sequelize models, and exports them for use in other parts of the application.

import { sequelize } from "@/db/sequelize";
import { UserCredentials } from "@/models/userCreds.model";

// The initModels function is responsible for synchronizing the Sequelize models with the database. It ensures that the necessary tables are created based on the defined models. This function should be called during the application startup to set up the database schema before handling any requests.
export const initModels = async () => {
  await sequelize.sync();
};

export { UserCredentials };
