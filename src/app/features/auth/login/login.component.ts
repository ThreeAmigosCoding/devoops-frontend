import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@core/auth/services/auth.service';
import { LoginRequest } from '@core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-container">
      <h1>Login</h1>
      <form (ngSubmit)="onSubmit()">
        <div>
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            [(ngModel)]="credentials.username"
            required
          />
        </div>
        <div>
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            [(ngModel)]="credentials.password"
            required
          />
        </div>
        <button type="submit">Login</button>
        <div class="error" *ngIf="errorMessage">{{ errorMessage }}</div>
      </form>
      <p>
        Don't have an account?
        <a routerLink="/auth/register">Register here</a>
      </p>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
    }
    form > div {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
    }
    input {
      width: 100%;
      padding: 0.5rem;
    }
    button {
      width: 100%;
      padding: 0.75rem;
      margin-top: 1rem;
    }
    .error {
      color: red;
      margin-top: 1rem;
    }
  `]
})
export class LoginComponent {
  credentials: LoginRequest = {
    username: '',
    password: ''
  };
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.authService.login(this.credentials).subscribe({
      next: () => {
        void this.router.navigate(['/search']);
      },
      error: (error) => {
        this.errorMessage = 'Login failed. Please check your credentials.';
        console.error('Login error:', error);
      }
    });
  }
}
