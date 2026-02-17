import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AvailabilityPeriodResponse, PricingMode } from '@core/models/accommodation.model';
import {
  AvailabilityPeriodDialogComponent,
  AvailabilityDialogResult
} from './availability-period-dialog.component';

@Component({
  selector: 'app-availability-section',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, DatePipe, CurrencyPipe],
  templateUrl: './availability-section.component.html',
  styleUrl: './availability-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvailabilitySectionComponent {
  @Input({ required: true }) periods!: AvailabilityPeriodResponse[];
  @Input() isOwner = false;
  @Input() pricingMode: PricingMode = PricingMode.PER_UNIT;

  @Output() addPeriod = new EventEmitter<AvailabilityDialogResult>();
  @Output() editPeriod = new EventEmitter<{ periodId: string; data: AvailabilityDialogResult }>();
  @Output() deletePeriod = new EventEmitter<string>();

  private readonly dialog = inject(MatDialog);

  get sortedPeriods(): AvailabilityPeriodResponse[] {
    return [...this.periods].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  }

  get pricingLabel(): string {
    return this.pricingMode === PricingMode.PER_GUEST ? '/ night / guest' : '/ night';
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AvailabilityPeriodDialogComponent, {
      data: {},
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result: AvailabilityDialogResult | undefined) => {
      if (result) {
        this.addPeriod.emit(result);
      }
    });
  }

  openEditDialog(period: AvailabilityPeriodResponse): void {
    const dialogRef = this.dialog.open(AvailabilityPeriodDialogComponent, {
      data: { period },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result: AvailabilityDialogResult | undefined) => {
      if (result) {
        this.editPeriod.emit({ periodId: period.id, data: result });
      }
    });
  }

  confirmDelete(periodId: string): void {
    if (confirm('Are you sure you want to delete this availability period?')) {
      this.deletePeriod.emit(periodId);
    }
  }
}
