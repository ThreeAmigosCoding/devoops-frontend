import { Component, inject, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { UserService } from '@core/services/user.service';
import { NotificationService } from '@core/services/notification.service';
import { AuthService } from '@core/auth/services/auth.service';
import { User, AuthResponse, UpdateProfileRequest } from '@core/models/user.model';
import { ChangePasswordDialogComponent } from './change-password-dialog.component';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog.component';
import { NotificationPreferencesSectionComponent } from './notification-preferences-section.component';

@Component({
  selector: 'app-profile-dialog',
  standalone: true,
  imports: [FormsModule, MatFormField, MatLabel, MatInput, MatButton, MatIcon, MatIconButton, MatError, MatDivider, NotificationPreferencesSectionComponent],
  templateUrl: './profile-dialog.component.html',
  styleUrl: './profile-dialog.component.scss'
})
export class ProfileDialogComponent implements OnInit, AfterViewInit {
  private readonly dialogRef = inject(MatDialogRef<ProfileDialogComponent>);
  private readonly userService = inject(UserService);
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild('profileForm') profileForm?: NgForm;

  user: User | null = null;
  isEditMode = false;
  isDeleting = false;
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

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
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

  onDeleteAccount(): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: {
        title: 'Delete Account',
        message: 'Are you sure you want to delete your account? This action cannot be undone.',
        confirmButtonText: 'Delete Account',
        cancelButtonText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed === true) {
        this.performAccountDeletion();
      }
    });
  }

  private performAccountDeletion(): void {
    this.isDeleting = true;
    this.userService.deleteAccount().subscribe({
      next: () => {
        this.notificationService.showSuccess('Your account has been deleted.');
        this.dialogRef.close();
        this.authService.logout();
      },
      error: (error) => {
        this.isDeleting = false;
        this.notificationService.showHttpError(error, 'Failed to delete account.');
      }
    });
  }

  isFormValid(): boolean {
    return this.profileForm?.valid ?? true;
  }
}
