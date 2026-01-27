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
  token: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  email: string;
  firstName: string;
  lastName: string;
  residence: string;
  role: UserRole;
}
