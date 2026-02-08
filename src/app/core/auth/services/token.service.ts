import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import {UserRole} from '@core/models/user.model';

export interface UserPayload {
  sub: string;
  userId: string;
  email: string;
  role: UserRole;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'accessToken';

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<UserPayload>(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getUserFromToken(token?: string | null): UserPayload | null {
    if (!token)
      token = this.getToken();

    try {
      return jwtDecode<UserPayload>(token!);
    } catch {
      return null;
    }
  }
}
