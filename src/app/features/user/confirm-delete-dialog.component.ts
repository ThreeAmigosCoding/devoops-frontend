import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

export interface ConfirmDeleteDialogData {
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  imports: [MatButton],
  template: `
    <div class="devoops-dialog">
      <div class="devoops-dialog-title-container">
        <h2>{{ data.title }}</h2>
      </div>
      <div class="devoops-dialog-content">
        <p class="delete-message">{{ data.message }}</p>
      </div>
      <div class="devoops-dialog-actions">
        <button mat-button (click)="onCancel()">{{ data.cancelButtonText || 'Cancel' }}</button>
        <button mat-flat-button color="warn" (click)="onConfirm()">{{ data.confirmButtonText || 'Delete' }}</button>
      </div>
    </div>
  `,
  styles: [`
    .delete-message {
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
    }
  `]
})
export class ConfirmDeleteDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ConfirmDeleteDialogComponent>);
  readonly data: ConfirmDeleteDialogData = inject(MAT_DIALOG_DATA);

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
