// This file defines TypeScript interfaces for the authentication service, including input types for registration and login, as well as types for user data and authentication tokens.

export interface RegisterInput {
  email: string;
  displayName: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UserData {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: UserData;
}
