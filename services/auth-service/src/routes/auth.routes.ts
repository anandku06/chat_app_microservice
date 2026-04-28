import { registerHandler } from "@/controllers/auth.controller";
import { validateRequest } from "@chat_app/common";
import { Router } from "express";
import { registerSchema } from "./auth.schema";

export const authRouter: Router = Router();

authRouter.post(
  "/register",
  validateRequest({ body: registerSchema.shape.body }),
  registerHandler,
);
