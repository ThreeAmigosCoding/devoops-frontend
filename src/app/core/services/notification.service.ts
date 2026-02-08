import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  /**
   * Display an error notification
   */
  showError(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-error']
    });
  }

  /**
   * Display a success notification
   */
  showSuccess(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-success']
    });
  }

  /**
   * Display an HTTP error with smart message extraction
   * @param error The HTTP error response
   * @param fallback Fallback message if error details cannot be extracted
   */
  showHttpError(error: HttpErrorResponse, fallback?: string): void {
    const message = this.extractErrorMessage(error) || fallback || 'An unexpected error occurred';
    this.showError(message);
  }

  /**
   * Extract error message from HTTP error response
   * Priority: error.detail > error.title > error.message
   */
  private extractErrorMessage(error: HttpErrorResponse): string | null {
    if (!error) return null;

    if (error.error) {
      if (typeof error.error === 'string') {
        return error.error;
      }

      if (error.error.detail) {
        return error.error.detail;
      }

      if (error.error.title) {
        return error.error.title;
      }

      if (error.error.message) {
        return error.error.message;
      }
    }

    if (error.message) {
      return error.message;
    }

    return null;
  }
}
