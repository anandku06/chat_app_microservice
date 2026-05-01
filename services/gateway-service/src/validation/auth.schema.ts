import { z } from "@chat_app/common";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  displayName: z
    .string()
    .min(3, "Display name must be at least 3 characters long"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export const revokeTokenSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
});
