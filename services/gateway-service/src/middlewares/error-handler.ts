import { HttpError } from "@chat_app/common";

import type { ErrorRequestHandler } from "express";
import { logger } from "@/utils/logger";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  logger.error({ err }, "An error occurred while processing the request");

  // If the error is an instance of HttpError, we can use its status code and message
  const error = err instanceof HttpError ? err : undefined;
  const statusCode = error?.statusCode ?? 500;

  // For 5xx errors, we don't want to expose the error message to the client for security reasons. Instead, we return a generic message.
  const message =
    statusCode >= 500
      ? "Internal Server Error"
      : (error?.message ?? "An error occurred");

  // If the error has additional details, we include them in the response. Otherwise, we just return the message.
  const poyload = error?.details
    ? { message, details: error.details }
    : { message };

  res.status(statusCode).json(poyload);

  // Call the next middleware in the stack, if any. In this case, we don't have any more middlewares to call, so we can just end the response.
  void _next();
};
