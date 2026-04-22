import { z } from "zod";
import { HttpError } from "../errors/http-error";

import type { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError, ZodTypeAny } from "zod";

// these types define the structure of the validation schema and the expected format of the request parameters and query.
type Schema = AnyZodObject | ZodTypeAny;
type ParamRecord = Record<string, string>;
type QueryRecord = Record<string, unknown>;

// This interface defines the structure of the validation schema that can be passed to the validateRequest middleware.
export interface RequestValidationSchema {
  body?: Schema;
  params?: Schema;
  query?: Schema;
}

// This function takes a ZodError and formats it into a more readable structure, where each issue is represented as an object containing the path to the invalid field and the corresponding error message. The path is constructed by joining the elements of the issue's path array with dots.
const formatedError = (error: ZodError) =>
  error.errors.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

// This function is a middleware for Express.js that validates incoming requests based on a provided schema. It checks the request body, parameters, and query against the specified Zod schemas. If validation fails, it throws an HttpError with a 422 status code and details about the validation issues.
export const validateRequest = (schema: RequestValidationSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        const result = schema.body.parse(req.body) as unknown;
        req.body = result;
      }

      if (schema.params) {
        const result = schema.params.parse(req.params) as ParamRecord;
        req.params = result as Request["params"];
      }

      if (schema.query) {
        const result = schema.query.parse(req.query) as QueryRecord;
        req.query = result as Request["query"];
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new HttpError(422, "Validation Error", {
            issues: formatedError(error),
          }),
        );
      }
    }
  };
};
