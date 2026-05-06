import type { UserRepository } from "@/repositories/user.repositories";
import type { CreateUserInput, User } from "@/types/user";

import { sequelize } from "@/db";
import { userRepository } from "@/repositories/user.repositories";
import { AuthUserRegisteredEventPayload } from "@chat_app/common";

class UserService {
  constructor(private readonly repos: UserRepository) {}

  async syncFromAuthUser(
    payload: AuthUserRegisteredEventPayload,
  ): Promise<User> {
    const user = await this.repos.upsertFromAuthEvent(payload);

    return user;
  }
}

export const userService = new UserService(userRepository);