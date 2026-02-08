import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { UserService } from '@core/services/user.service';
import { ChangePasswordRequest } from '@core/models/user.model';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [FormsModule, MatFormField, MatLabel, MatInput, MatButton],
  template: `
    <div class="devoops-dialog">
        <div class="devoops-dialog-title-container">
          <h2>Change Password</h2>
        </div>
        <div class="devoops-dialog-content">
          @if (errorMessage) {
            <p class="error">{{ errorMessage }}</p>
          }
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Current Password</mat-label>
            <input matInput type="password" [(ngModel)]="form.currentPassword" name="currentPassword" required />
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>New Password</mat-label>
            <input matInput type="password" [(ngModel)]="form.newPassword" name="newPassword" required />
          </mat-form-field>
        </div>
        <div class="devoops-dialog-actions">
            <button mat-button (click)="onCancel()">Cancel</button>
            <button mat-flat-button color="primary" (click)="onSubmit()">Change</button>
        </div>
    </div>
  `,
  styles: [`
    mat-dialog-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 320px;
    }
    .full-width {
      width: 100%;
    }
    .error {
      color: var(--mat-sys-error);
      margin: 0 0 8px;
    }
  `]
})
export class ChangePasswordDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ChangePasswordDialogComponent>);
  private readonly userService = inject(UserService);

  form: ChangePasswordRequest = {
    currentPassword: '',
    newPassword: ''
  };
  errorMessage = '';

  onSubmit(): void {
    this.errorMessage = '';
    this.userService.changePassword(this.form).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.errorMessage = 'Failed to change password. Please check your current password.';
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
