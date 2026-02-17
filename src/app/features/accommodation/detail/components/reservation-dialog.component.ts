import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AccommodationResponse, AvailabilityPeriodResponse, PricingMode } from '@core/models/accommodation.model';
import { ReservationService } from '@core/services/reservation.service';
import { NotificationService } from '@core/services/notification.service';
import { ReservationResponse } from '@core/models/reservation.model';

export interface ReservationDialogData {
  accommodation: AccommodationResponse;
  availability: AvailabilityPeriodResponse[];
}

@Component({
  selector: 'app-reservation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Reserve {{ data.accommodation.name }}</h2>
    <mat-dialog-content>
      <div class="pricing-info">
        <mat-icon>payments</mat-icon>
        <span>{{ data.accommodation.pricingMode === 'PER_GUEST' ? 'Price per guest per night' : 'Price per unit per night' }}</span>
      </div>

      <form [formGroup]="form" class="dialog-form">
        <mat-form-field appearance="outline">
          <mat-label>Select dates</mat-label>
          <mat-date-range-input [rangePicker]="picker" [min]="minDate" [dateFilter]="dateFilter">
            <input matStartDate formControlName="startDate" placeholder="Check-in" />
            <input matEndDate formControlName="endDate" placeholder="Check-out" />
          </mat-date-range-input>
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-date-range-picker #picker></mat-date-range-picker>
          @if (form.controls['startDate'].hasError('required') || form.controls['endDate'].hasError('required')) {
            <mat-error>Both dates are required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Number of Guests</mat-label>
          <input matInput type="number" formControlName="guestCount"
                 [min]="data.accommodation.minGuests"
                 [max]="data.accommodation.maxGuests" />
          @if (form.controls['guestCount'].hasError('required')) {
            <mat-error>Guest count is required</mat-error>
          }
          @if (form.controls['guestCount'].hasError('min')) {
            <mat-error>Minimum {{ data.accommodation.minGuests }} guest(s)</mat-error>
          }
          @if (form.controls['guestCount'].hasError('max')) {
            <mat-error>Maximum {{ data.accommodation.maxGuests }} guests</mat-error>
          }
          <mat-hint>{{ data.accommodation.minGuests }}–{{ data.accommodation.maxGuests }} guests</mat-hint>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid || submitting" (click)="submit()">
        {{ submitting ? 'Submitting...' : 'Reserve' }}
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

    .pricing-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      color: var(--mat-sys-on-surface-variant, #666);
      font-size: 0.875rem;
    }

    mat-date-range-input ::ng-deep input::placeholder {
      color: var(--mat-sys-on-surface, #1c1b1f);
      opacity: 0.7;
    }

`]
})
export class ReservationDialogComponent {
  form: FormGroup;
  minDate = new Date();
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ReservationDialogComponent>,
    private reservationService: ReservationService,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: ReservationDialogData
  ) {
    this.form = this.fb.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      guestCount: [data.accommodation.minGuests, [
        Validators.required,
        Validators.min(data.accommodation.minGuests),
        Validators.max(data.accommodation.maxGuests)
      ]]
    });
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    return this.data.availability.some(period => {
      const start = new Date(period.startDate);
      const end = new Date(period.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return date >= start && date <= end;
    });
  };

  submit(): void {
    if (this.form.invalid || this.submitting) return;

    this.submitting = true;
    const { startDate, endDate, guestCount } = this.form.value;

    this.reservationService.create({
      accommodationId: this.data.accommodation.id,
      startDate: this.formatDate(startDate),
      endDate: this.formatDate(endDate),
      guestCount
    }).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
      },
      error: (err) => {
        this.submitting = false;
        this.notificationService.showHttpError(err, 'Failed to create reservation');
      }
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
