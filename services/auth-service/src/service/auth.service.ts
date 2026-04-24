import { sequelize } from "@/db/sequelize";
import { RefreshToken, UserCredentials } from "@/models";
import { AuthResponse, RegisterInput } from "@/types/auth";
import { hashPassword, signAccessToken, signRefreshToken } from "@/utils/token";
import { HttpError } from "@chat_app/common";
import { Op, Transaction } from "sequelize";

const REFRESH_TOKEN_TTL_DAYS = 7;

export const register = async (input: RegisterInput): Promise<AuthResponse> => {
  const existingUser = await UserCredentials.findOne({
    where: {
      email: { [Op.eq]: input.email },
    },
  });

  if (existingUser) {
    throw new HttpError(400, "Email is already in use");
  }

  const transaction = await sequelize.transaction();
  try {
    const passHash = await hashPassword(input.password);
    const user = await UserCredentials.create(
      {
        email: input.email,
        displayName: input.displayName,
        passwordHash: passHash,
      },
      { transaction },
    );

    const refreshTokenRecord = await createRefreshToken(user.id, transaction);

    await transaction.commit();

    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    const refreshToken = signRefreshToken({
      sub: user.id,
      tokenId: refreshTokenRecord.token,
    });

    const userData = {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt.toISOString(),
    };

    // todo: publish event to message broker

    return {
      accessToken,
      refreshToken,
      user: userData,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const createRefreshToken = async (
  userId: string,
  transaction?: Transaction,
) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_TTL_DAYS);

  const token = crypto.randomUUID();

  const record = await RefreshToken.create(
    {
      userId,
      token,
      expiresAt,
    },
    { transaction },
  );

  return record;
};
