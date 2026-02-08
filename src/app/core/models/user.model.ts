export enum UserRole {
  GUEST = 'GUEST',
  HOST = 'HOST'
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  residence: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  residence: string;
  role: UserRole;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  residence?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
