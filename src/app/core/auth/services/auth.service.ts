import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from '@core/services/api.service';
import { TokenService } from './token.service';
import {
  User,
  UserRole,
  AuthResponse,
  LoginRequest,
  RegisterRequest
} from '@core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private api: ApiService,
    private tokenService: TokenService
  ) {
    this.loadUserFromToken();
  }

  private loadUserFromToken(): void {
    if (this.tokenService.hasValidToken()) {
      const user = this.tokenService.getUserFromToken();
      this.currentUserSubject.next(user);
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/user/login', credentials).pipe(
      tap(response => {
        this.tokenService.setToken(response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/user/register', data).pipe(
      tap(response => {
        this.tokenService.setToken(response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    this.tokenService.removeToken();
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.tokenService.hasValidToken();
  }

  hasRole(role: UserRole): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === role;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
