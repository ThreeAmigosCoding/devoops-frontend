import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { AvailabilityPeriodResponse } from '@core/models/accommodation.model';

export interface AvailabilityDialogData {
  period?: AvailabilityPeriodResponse;
}

export interface AvailabilityDialogResult {
  startDate: string;
  endDate: string;
  pricePerDay: number;
}

@Component({
  selector: 'app-availability-period-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.period ? 'Edit' : 'Add' }} Availability Period</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field appearance="outline">
          <mat-label>Date Range</mat-label>
          <mat-date-range-input [rangePicker]="picker" [min]="minDate">
            <input matStartDate formControlName="startDate" placeholder="Start date" />
            <input matEndDate formControlName="endDate" placeholder="End date" />
          </mat-date-range-input>
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-date-range-picker #picker></mat-date-range-picker>
          @if (form.controls['startDate'].hasError('required') || form.controls['endDate'].hasError('required')) {
            <mat-error>Both dates are required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Price per Night</mat-label>
          <input matInput type="number" formControlName="pricePerDay" min="0.01" step="0.01" />
          <span matTextPrefix>$&nbsp;</span>
          @if (form.controls['pricePerDay'].hasError('required')) {
            <mat-error>Price is required</mat-error>
          }
          @if (form.controls['pricePerDay'].hasError('min')) {
            <mat-error>Price must be greater than 0</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="submit()">
        {{ data.period ? 'Update' : 'Add' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-width: 300px;
      padding-top: 0.5rem;
    }

`]
})
export class AvailabilityPeriodDialogComponent {
  form: FormGroup;
  minDate = new Date();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AvailabilityPeriodDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AvailabilityDialogData
  ) {
    const period = data.period;
    this.form = this.fb.group({
      startDate: [period ? new Date(period.startDate) : null, Validators.required],
      endDate: [period ? new Date(period.endDate) : null, Validators.required],
      pricePerDay: [period?.pricePerDay ?? null, [Validators.required, Validators.min(0.01)]]
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    const { startDate, endDate, pricePerDay } = this.form.value;
    const result: AvailabilityDialogResult = {
      startDate: this.formatDate(startDate),
      endDate: this.formatDate(endDate),
      pricePerDay
    };
    this.dialogRef.close(result);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
