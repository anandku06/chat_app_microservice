import bcrypt from "bcrypt";
import jwt, { type SignOptions, type Secret } from "jsonwebtoken";

const ACCESS_TOKEN: Secret = process.env.JWT_SECRET as Secret;
const REFRESH_TOKEN: Secret = process.env.JWT_REFRESH_SECRET as Secret;
const ACCESS_OPTIONS: SignOptions = {
  expiresIn: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
};

const REFRESH_OPTIONS: SignOptions = {
  expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export interface AccessTokenPayload {
  sub: string; // user ID
  email: string;
}

export interface RefreshTokenPayload {
  sub: string; // user ID
  tokenId: string;
}

export const signAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, ACCESS_TOKEN, ACCESS_OPTIONS);
};

export const signRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, REFRESH_TOKEN, REFRESH_OPTIONS);
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, REFRESH_TOKEN) as RefreshTokenPayload;
};
