import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { AuthService } from '@core/auth/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { RegisterRequest, UserRole } from '@core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, MatFormField, MatLabel, MatError, MatInput, MatButton, MatSelect, MatOption],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

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

  onSubmit(): void {
    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.notificationService.showSuccess('Registration successful! Welcome aboard.');
        void this.router.navigate(['/accommodations']);
      },
      error: (error) => {
        this.notificationService.showHttpError(error, 'Registration failed. Please try again.');
        console.error('Registration error:', error);
      }
    });
  }
}
