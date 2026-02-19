import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AccommodationSearchParams } from '@core/models/accommodation.model';

@Component({
  selector: 'app-accommodation-search-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <form [formGroup]="searchForm" (ngSubmit)="onSearch()" class="search-form">
      <mat-form-field appearance="outline" class="search-field location-field">
        <mat-label>Location</mat-label>
        <mat-icon matPrefix>location_on</mat-icon>
        <input matInput formControlName="location" placeholder="e.g. Belgrade">
      </mat-form-field>

      <mat-form-field appearance="outline" class="search-field guests-field">
        <mat-label>Guests</mat-label>
        <mat-icon matPrefix>people</mat-icon>
        <input matInput type="number" formControlName="guests" min="1" placeholder="2">
      </mat-form-field>

      <mat-form-field appearance="outline" class="search-field date-field">
        <mat-label>Check-in - Check-out</mat-label>
        <mat-date-range-input [rangePicker]="picker" [min]="minDate">
          <input matStartDate formControlName="startDate" placeholder="Start date">
          <input matEndDate formControlName="endDate" placeholder="End date">
        </mat-date-range-input>
        <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-date-range-picker #picker></mat-date-range-picker>
      </mat-form-field>

      <div class="search-actions">
        <button mat-flat-button color="primary" type="submit" [disabled]="searchForm.invalid">
          <mat-icon>search</mat-icon>
          Search
        </button>
        <button mat-stroked-button type="button" (click)="onClear()">
          Clear
        </button>
      </div>
    </form>
  `,
  styles: [`
    .search-form {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.5rem;
      background: var(--mat-sys-surface-container-lowest, #fff);
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      margin-bottom: 2rem;
    }

    .search-field {
      flex: 1;
      min-width: 180px;
    }

    .location-field {
      flex: 2;
    }

    .guests-field {
      flex: 0.7;
      min-width: 120px;
    }

    .date-field {
      flex: 2;
      min-width: 250px;
    }

    .search-actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      padding-top: 4px;
    }

    @media (max-width: 768px) {
      .search-form {
        flex-direction: column;
      }

      .search-field {
        width: 100%;
        min-width: unset;
      }

      .search-actions {
        width: 100%;
        justify-content: stretch;

        button {
          flex: 1;
        }
      }
    }
  `]
})
export class AccommodationSearchFormComponent {
  @Output() searchEvent = new EventEmitter<AccommodationSearchParams>();
  @Output() clearEvent = new EventEmitter<void>();

  minDate = new Date();
  searchForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      location: ['', Validators.required],
      guests: [null, [Validators.required, Validators.min(1)]],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required]
    });
  }

  onSearch(): void {
    if (this.searchForm.invalid) return;

    const { location, guests, startDate, endDate } = this.searchForm.value;
    this.searchEvent.emit({
      location,
      guests,
      startDate: this.formatDate(startDate),
      endDate: this.formatDate(endDate)
    });
  }

  onClear(): void {
    this.searchForm.reset();
    this.clearEvent.emit();
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
