import pino from "pino";
import type { Logger, LoggerOptions } from "pino";

type CreateLoggerOptions = LoggerOptions & {
  name: string;
};

export const createLogger = (options: CreateLoggerOptions): Logger => {
  const { name, ...rest } = options;

  // In development, we want to use pino-pretty for better readability of logs. In production, we can use the default pino logger which is more performant.

  const transport =
    process.env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
          },
        }
      : undefined;

  return pino({
    name,
    level: process.env.LOG_LEVEL || "info",
    transport,
    ...rest,
  });
};
