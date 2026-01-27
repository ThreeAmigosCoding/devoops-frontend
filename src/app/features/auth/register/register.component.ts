import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@core/auth/services/auth.service';
import { RegisterRequest, UserRole } from '@core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="register-container">
      <h1>Register</h1>
      <form (ngSubmit)="onSubmit()">
        <div>
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            [(ngModel)]="registerData.username"
            required
          />
        </div>
        <div>
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            [(ngModel)]="registerData.email"
            required
          />
        </div>
        <div>
          <label for="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            [(ngModel)]="registerData.firstName"
            required
          />
        </div>
        <div>
          <label for="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            [(ngModel)]="registerData.lastName"
            required
          />
        </div>
        <div>
          <label for="residence">Residence</label>
          <input
            type="text"
            id="residence"
            name="residence"
            [(ngModel)]="registerData.residence"
            required
          />
        </div>
        <div>
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            [(ngModel)]="registerData.password"
            required
          />
        </div>
        <div>
          <label for="role">I want to be a:</label>
          <select
            id="role"
            name="role"
            [(ngModel)]="registerData.role"
            required
          >
            <option [value]="UserRole.GUEST">Guest</option>
            <option [value]="UserRole.HOST">Host</option>
          </select>
        </div>
        <button type="submit">Register</button>
        <div class="error" *ngIf="errorMessage">{{ errorMessage }}</div>
      </form>
      <p>
        Already have an account?
        <a routerLink="/auth/login">Login here</a>
      </p>
    </div>
  `,
  styles: [`
    .register-container {
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
    input, select {
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
export class RegisterComponent {
  UserRole = UserRole;

  registerData: RegisterRequest = {
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    residence: '',
    password: '',
    role: UserRole.GUEST
  };
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.router.navigate(['/search']);
      },
      error: (error) => {
        this.errorMessage = 'Registration failed. Please try again.';
        console.error('Registration error:', error);
      }
    });
  }
}
