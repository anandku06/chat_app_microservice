import { register } from "@/service/auth.service";
import { asyncHandler } from "@chat_app/common";
import { RequestHandler } from "express";

export const registerHandler: RequestHandler = asyncHandler(
  async (req, res) => {
    // Implementation of the register handler

    const payload = req.body; // Assuming the request body has been validated and parsed

    // Call the register service with the payload
    const tokens = await register(payload);

    // Respond with the generated tokens and user data
    res.status(201).json(tokens);
  },
);
