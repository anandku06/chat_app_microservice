import "dotenv/config";
import { createEnv, z } from "@chat_app/common";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  AUTH_SERVICE_PORT: z.coerce.number().int().min(0).max(65_535).default(4003),
  AUTH_DB_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("1d"),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  INTERNAL_API_TOKEN: z.string().min(16, "Internal API token is required"),
  RABBITMQ_URL: z.string().url(),
});

type EnvType = z.infer<typeof envSchema>; // Infer the TypeScript type from the Zod schema

export const env: EnvType = createEnv(envSchema, {
  serviceName: "Auth Service",
}); // Create the environment configuration using the schema and export it

export type Env = typeof env; // Export the type of the environment configuration for use in other parts of the application
