/**
 * This module provides middleware for internal authentication in an Express application. It checks for a specific token in the request headers and allows access to certain paths without authentication if specified. If the token is missing or incorrect, it throws an HTTP error.
 */

import { HttpError } from "../errors/http-error";

import type { RequestHandler } from "express";

export interface InternalAuthOptions {
  headerName?: string;
  exemptPaths?: string[];
}

const DEFAULT_HEADER_NAME = "x-internal-token";

export const createInternalAuthMiddleware = (
  expectedToken: string,
  options: InternalAuthOptions = {},
): RequestHandler => {
  const headerName = options.headerName?.toLowerCase() ?? DEFAULT_HEADER_NAME;

  // Normalize exempt paths to a Set for O(1) lookups; why because we want to efficiently check if a path is exempt from authentication
  const exemptPaths = new Set(options.exemptPaths ?? []);

  return (req, _res, next) => {
    // Check if the request path is exempt from authentication
    if (exemptPaths.has(req.path)) {
      next();
      return;
    }

    // Get the data from the specified header
    const provided = req.headers[headerName];

    // If the token is missing or does not match the expected token, throw an HTTP error
    const token = Array.isArray(provided) ? provided[0] : provided;
    if (typeof token !== "string" || token !== expectedToken) {
      next(
        new HttpError(401, "Unauthorized: Invalid or missing internal token"),
      );
      return;
    }

    next();
  };
};
