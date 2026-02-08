import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { UserService } from '@core/services/user.service';
import { NotificationService } from '@core/services/notification.service';
import { User, AuthResponse, UpdateProfileRequest } from '@core/models/user.model';
import { ChangePasswordDialogComponent } from './change-password-dialog.component';

@Component({
  selector: 'app-profile-dialog',
  standalone: true,
  imports: [FormsModule, MatFormField, MatLabel, MatInput, MatButton, MatIcon, MatIconButton, MatError],
  templateUrl: './profile-dialog.component.html',
  styleUrl: './profile-dialog.component.scss'
})
export class ProfileDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<ProfileDialogComponent>);
  private readonly userService = inject(UserService);
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);

  @ViewChild('profileForm') profileForm?: NgForm;

  user: User | null = null;
  isEditMode = false;
  editForm: UpdateProfileRequest = {};

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.resetEditForm();
      },
      error: (error) => {
        this.notificationService.showHttpError(error, 'Failed to load profile.');
      }
    });
  }

  private resetEditForm(): void {
    if (!this.user) return;
    this.editForm = {
      username: this.user.username,
      email: this.user.email,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      residence: this.user.residence
    };
  }

  onEdit(): void {
    this.isEditMode = true;
  }

  onCancel(): void {
    this.isEditMode = false;
    this.resetEditForm();
  }

  onSave(): void {
    this.userService.updateProfile(this.editForm).subscribe({
      next: (response: AuthResponse) => {
        this.user = response.user;
        this.isEditMode = false;
        this.notificationService.showSuccess('Profile updated successfully.');
      },
      error: (error) => {
        this.notificationService.showHttpError(error, 'Failed to update profile.');
      }
    });
  }

  onChangePassword(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.notificationService.showSuccess('Password changed successfully.');
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  isFormValid(): boolean {
    return this.profileForm?.valid ?? true;
  }
}
