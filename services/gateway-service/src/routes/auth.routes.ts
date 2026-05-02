import { registerUser } from "@/controller/auth.controller";
import { registerSchema } from "@/validation/auth.schema";
import { asyncHandler, validateRequest } from "@chat_app/common";
import { Router } from "express";

export const authRouter: Router = Router();

// uses validation middleware to ensure that the incoming request body for the registration endpoint adheres to the defined schema, and then delegates the actual registration logic to the registerUser controller function, which is wrapped in an asyncHandler to handle any asynchronous errors gracefully.
authRouter.post(
  "/register",
  validateRequest({ body: registerSchema }),
  asyncHandler(registerUser),
);
