// This file defines a type for asynchronous request handlers in Express.js, along with utility functions to convert unknown errors to Error objects and to forward errors to the next middleware.

import type { NextFunction, Request, Response, RequestHandler } from "express";

export type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

// Utility function to convert unknown errors to Error objects
const toError = (error: unknown): Error => {
  return error instanceof Error ? error : new Error(String(error));
};

// Utility function to forward errors to the next middleware
type ErrorForwarder = (error: unknown) => void;

// Example usage of forwardError in an async handler
const forwardError = (nextFn: ErrorForwarder, error: unknown) => {
  nextFn(toError(error));
};

// Higher-order function to wrap async handlers and forward errors to the next middleware
export const asyncHandler = (handler: AsyncHandler): RequestHandler => {
  return (req, res, next) => {
    void handler(req, res, next).catch((error: unknown) => {
      forwardError(next as ErrorForwarder, error);
    });
  };
};
