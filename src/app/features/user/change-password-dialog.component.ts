import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { UserService } from '@core/services/user.service';
import { NotificationService } from '@core/services/notification.service';
import { ChangePasswordRequest } from '@core/models/user.model';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [FormsModule, MatFormField, MatLabel, MatError, MatInput, MatButton],
  template: `
    <div class="devoops-dialog">
        <div class="devoops-dialog-title-container">
          <h2>Change Password</h2>
        </div>
        <div class="devoops-dialog-content">
          <form #passwordForm="ngForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Current Password</mat-label>
              <input matInput type="password" [(ngModel)]="form.currentPassword" name="currentPassword" required minlength="8" #currentPasswordInput="ngModel" />
              <mat-error>
                @if (currentPasswordInput.errors?.['required']) { Current password is required }
                @if (currentPasswordInput.errors?.['minlength']) { Password must be at least 8 characters }
              </mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>New Password</mat-label>
              <input matInput type="password" [(ngModel)]="form.newPassword" name="newPassword" required minlength="8" #newPasswordInput="ngModel" />
              <mat-error>
                @if (newPasswordInput.errors?.['required']) { New password is required }
                @if (newPasswordInput.errors?.['minlength']) { Password must be at least 8 characters }
              </mat-error>
            </mat-form-field>
          </form>
        </div>
        <div class="devoops-dialog-actions">
            <button mat-button (click)="onCancel()">Cancel</button>
            <button mat-flat-button color="primary" (click)="onSubmit()" [disabled]="!isFormValid()">Change</button>
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
  `]
})
export class ChangePasswordDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ChangePasswordDialogComponent>);
  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);

  @ViewChild('passwordForm') passwordForm?: NgForm;

  form: ChangePasswordRequest = {
    currentPassword: '',
    newPassword: ''
  };

  onSubmit(): void {
    this.userService.changePassword(this.form).subscribe({
      next: () => this.dialogRef.close(true),
      error: (error) => {
        this.notificationService.showHttpError(error, 'Failed to change password. Please check your current password.');
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  isFormValid(): boolean {
    return this.passwordForm?.valid ?? false;
  }
}
