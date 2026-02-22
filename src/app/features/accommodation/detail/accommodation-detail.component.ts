import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';

import { AccommodationService } from '@core/services/accommodation.service';
import { AuthService } from '@core/auth/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import {
  AccommodationResponse,
  AccommodationPhotoResponse,
  AvailabilityPeriodResponse,
  PricingMode,
  ApprovalMode
} from '@core/models/accommodation.model';
import { UserRole } from '@core/models/user.model';

import { PhotoGalleryComponent } from './components/photo-gallery/photo-gallery.component';
import { AmenitiesListComponent } from './components/amenities-list/amenities-list.component';
import { AvailabilitySectionComponent } from './components/availability-section/availability-section.component';
import { AvailabilityDialogResult } from './components/availability-section/availability-period-dialog.component';
import { ReservationDialogComponent, ReservationDialogData } from './components/reservation-dialog.component';
import { ReservationResponse } from '@core/models/reservation.model';
import { AccommodationRatingsComponent } from './components/accommodation-ratings/accommodation-ratings.component';

@Component({
  selector: 'app-accommodation-detail',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule,
    PhotoGalleryComponent,
    AmenitiesListComponent,
    AvailabilitySectionComponent,
    AccommodationRatingsComponent
  ],
  templateUrl: './accommodation-detail.component.html',
  styleUrl: './accommodation-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccommodationDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly accommodationService = inject(AccommodationService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(MatDialog);

  accommodation = signal<AccommodationResponse | null>(null);
  photos = signal<AccommodationPhotoResponse[]>([]);
  availability = signal<AvailabilityPeriodResponse[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  isOwner = computed(() => {
    const acc = this.accommodation();
    const user = this.authService.getCurrentUser();
    return !!acc && !!user && user.userId === acc.hostId;
  });

  isGuest = computed(() => {
    const user = this.authService.getCurrentUser();
    return !!user && user.role === UserRole.GUEST;
  });

  isAuthenticated = computed(() => this.authService.isAuthenticated());

  guestCapacity = computed(() => {
    const acc = this.accommodation();
    if (!acc) return '';
    if (acc.minGuests === acc.maxGuests) return `${acc.maxGuests} guests`;
    return `${acc.minGuests}–${acc.maxGuests} guests`;
  });

  pricingModeLabel = computed(() => {
    const acc = this.accommodation();
    if (!acc) return '';
    return acc.pricingMode === PricingMode.PER_GUEST ? 'Price per guest' : 'Price per unit';
  });

  approvalModeLabel = computed(() => {
    const acc = this.accommodation();
    if (!acc) return '';
    return acc.approvalMode === ApprovalMode.AUTOMATIC ? 'Automatic approval' : 'Manual approval';
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Accommodation not found');
      this.loading.set(false);
      return;
    }
    this.loadData(id);
  }

  private loadData(id: string): void {
    forkJoin({
      accommodation: this.accommodationService.getById(id),
      photos: this.accommodationService.getPhotos(id),
      availability: this.accommodationService.getAvailability(id)
    }).subscribe({
      next: ({ accommodation, photos, availability }) => {
        this.accommodation.set(accommodation);
        this.photos.set(photos.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999)));
        this.availability.set(availability);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load accommodation details');
        this.loading.set(false);
        this.notificationService.showHttpError(err, 'Failed to load accommodation details');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/accommodations']);
  }

  onAddPeriod(data: AvailabilityDialogResult): void {
    const acc = this.accommodation();
    if (!acc) return;

    this.accommodationService.createAvailability(acc.id, data).subscribe({
      next: (period) => {
        this.availability.update(periods => [...periods, period]);
        this.notificationService.showSuccess('Availability period added');
      },
      error: (err) => this.notificationService.showHttpError(err, 'Failed to add availability period')
    });
  }

  onEditPeriod(event: { periodId: string; data: AvailabilityDialogResult }): void {
    const acc = this.accommodation();
    if (!acc) return;

    this.accommodationService.updateAvailability(acc.id, event.periodId, event.data).subscribe({
      next: (updated) => {
        this.availability.update(periods =>
          periods.map(p => p.id === event.periodId ? updated : p)
        );
        this.notificationService.showSuccess('Availability period updated');
      },
      error: (err) => this.notificationService.showHttpError(err, 'Failed to update availability period')
    });
  }

  onDeletePeriod(periodId: string): void {
    const acc = this.accommodation();
    if (!acc) return;

    this.accommodationService.deleteAvailability(acc.id, periodId).subscribe({
      next: () => {
        this.availability.update(periods => periods.filter(p => p.id !== periodId));
        this.notificationService.showSuccess('Availability period deleted');
      },
      error: (err) => this.notificationService.showHttpError(err, 'Failed to delete availability period')
    });
  }

  onReserve(): void {
    const acc = this.accommodation();
    if (!acc) return;

    const dialogRef = this.dialog.open<ReservationDialogComponent, ReservationDialogData, ReservationResponse>(
      ReservationDialogComponent,
      {
        data: {
          accommodation: acc,
          availability: this.availability()
        },
        width: '400px'
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notificationService.showSuccess('Reservation request submitted');
      }
    });
  }
}
