import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthService } from '@core/auth/services/auth.service';
import { User, AuthResponse, UpdateProfileRequest, ChangePasswordRequest } from '@core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly api = inject(ApiService);
  private readonly authService = inject(AuthService);

  getProfile(): Observable<User> {
    return this.api.get<User>('/user/me');
  }

  getById(id: string): Observable<User> {
    return this.api.get<User>(`/user/${id}`);
  }

  updateProfile(data: UpdateProfileRequest): Observable<AuthResponse> {
    return this.api.put<AuthResponse>('/user/me', data).pipe(
      tap(response => this.authService.handleAuthResponse(response))
    );
  }

  changePassword(data: ChangePasswordRequest): Observable<void> {
    return this.api.put<void>('/user/me/password', data);
  }

  deleteAccount(): Observable<void> {
    return this.api.delete<void>('/user/me');
  }
}
