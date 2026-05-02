import { AsyncHandler } from "@chat_app/common";
import { registerSchema } from "@/validation/auth.schema";
import { authProxyService } from "@/service/auth-proxy.service";

export const registerUser: AsyncHandler = async (req, res, next) => {
  try {
    const payload = registerSchema.parse(req.body);
    const response = await authProxyService.register(payload);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};
