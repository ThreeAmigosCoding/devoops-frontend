import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { UserService } from '@core/services/user.service';
import { User, AuthResponse, UpdateProfileRequest } from '@core/models/user.model';
import { ChangePasswordDialogComponent } from './change-password-dialog.component';

@Component({
  selector: 'app-profile-dialog',
  standalone: true,
  imports: [FormsModule, MatFormField, MatLabel, MatInput, MatButton, MatIcon, MatIconButton],
  templateUrl: './profile-dialog.component.html',
  styleUrl: './profile-dialog.component.scss'
})
export class ProfileDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<ProfileDialogComponent>);
  private readonly userService = inject(UserService);
  private readonly dialog = inject(MatDialog);

  user: User | null = null;
  isEditMode = false;
  editForm: UpdateProfileRequest = {};
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.resetEditForm();
      },
      error: () => {
        this.errorMessage = 'Failed to load profile.';
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
    this.errorMessage = '';
    this.successMessage = '';
  }

  onCancel(): void {
    this.isEditMode = false;
    this.resetEditForm();
    this.errorMessage = '';
  }

  onSave(): void {
    this.errorMessage = '';
    this.userService.updateProfile(this.editForm).subscribe({
      next: (response: AuthResponse) => {
        this.user = response.user;
        this.isEditMode = false;
        this.successMessage = 'Profile updated successfully.';
      },
      error: () => {
        this.errorMessage = 'Failed to update profile.';
      }
    });
  }

  onChangePassword(): void {
    this.dialog.open(ChangePasswordDialogComponent);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
