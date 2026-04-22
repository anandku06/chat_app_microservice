/**
 * Why do we need this class?
 * In a microservices architecture, we often need to communicate errors between services.
 * The HttpError class provides a standardized way to represent HTTP errors, including the status code, message, and any additional details.
 * This allows for consistent error handling across different services and makes it easier to debug issues when they arise.
 */

export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "HttpError";
  }
}
