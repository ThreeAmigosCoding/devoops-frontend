import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from '@core/services/api.service';
import {UserPayload, TokenService} from './token.service';
import {
  UserRole,
  AuthResponse,
  LoginRequest,
  RegisterRequest
} from '@core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserPayload | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private api: ApiService,
    private tokenService: TokenService,
    private router: Router
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
    return this.api.post<AuthResponse>('/user/auth/login', credentials).pipe(
      tap(response => {
        this.tokenService.setToken(response.accessToken);
        this.currentUserSubject.next(this.tokenService.getUserFromToken(response.accessToken));
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/user/auth/register', data).pipe(
      tap(response => {
        this.tokenService.setToken(response.accessToken);
        this.currentUserSubject.next(this.tokenService.getUserFromToken(response.accessToken));
      })
    );
  }

  logout(): void {
    this.tokenService.removeToken();
    this.currentUserSubject.next(null);
    void this.router.navigate(['/accommodations']);
  }

  isAuthenticated(): boolean {
    return this.tokenService.hasValidToken();
  }

  hasRole(role: UserRole): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === role;
  }

  getCurrentUser(): UserPayload | null {
    return this.currentUserSubject.value;
  }
}
