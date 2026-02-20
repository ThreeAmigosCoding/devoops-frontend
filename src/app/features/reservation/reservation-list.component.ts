import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '@core/auth/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { ReservationService } from '@core/services/reservation.service';
import { ReservationResponse, ReservationStatus, ReservationWithGuestInfoResponse } from '@core/models/reservation.model';
import { UserRole } from '@core/models/user.model';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.scss'
})
export class ReservationListComponent implements OnInit {
  private readonly reservationService = inject(ReservationService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  reservations = signal<(ReservationResponse | ReservationWithGuestInfoResponse)[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  confirmingId = signal<string | null>(null);
  actionInProgress = signal<string | null>(null);
  approvingId = signal<string | null>(null);
  rejectingId = signal<string | null>(null);

  readonly ReservationStatus = ReservationStatus;

  selectedStatus = signal<ReservationStatus | 'ALL'>('ALL');

  readonly statusFilters: Array<ReservationStatus | 'ALL'> = [
    'ALL', ReservationStatus.PENDING, ReservationStatus.APPROVED,
    ReservationStatus.REJECTED, ReservationStatus.CANCELLED
  ];

  filteredReservations = computed(() => {
    const status = this.selectedStatus();
    const list = status === 'ALL'
      ? this.reservations()
      : this.reservations().filter(r => r.status === status);
    return [...list].sort((a, b) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
  });

  get isGuest(): boolean {
    return this.authService.hasRole(UserRole.GUEST);
  }

  get isHost(): boolean {
    return this.authService.hasRole(UserRole.HOST);
  }

  ngOnInit(): void {
    this.loadReservations();
  }

  private loadReservations(): void {
    this.loading.set(true);
    this.error.set(null);

    const obs$ = this.isGuest
      ? this.reservationService.getByGuest()
      : this.reservationService.getByHost();

    obs$.subscribe({
      next: (data) => {
        this.reservations.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load reservations. Please try again.');
        this.loading.set(false);
        console.error('Error loading reservations:', err);
      }
    });
  }

  retry(): void {
    this.loadReservations();
  }

  canCancel(reservation: ReservationResponse): boolean {
    const startDate = new Date(reservation.startDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return startDate > tomorrow;
  }

  startConfirm(id: string): void {
    this.confirmingId.set(id);
  }

  cancelConfirm(): void {
    this.confirmingId.set(null);
  }

  deleteRequest(id: string): void {
    this.actionInProgress.set(id);
    this.confirmingId.set(null);

    this.reservationService.deleteRequest(id).subscribe({
      next: () => {
        this.reservations.update(list => list.filter(r => r.id !== id));
        this.actionInProgress.set(null);
        this.notificationService.showSuccess('Reservation request deleted.');
      },
      error: (err) => {
        this.actionInProgress.set(null);
        this.notificationService.showHttpError(err);
      }
    });
  }

  cancelReservation(id: string): void {
    this.actionInProgress.set(id);
    this.confirmingId.set(null);

    this.reservationService.cancel(id).subscribe({
      next: () => {
        this.reservations.update(list =>
          list.map(r => r.id === id ? { ...r, status: ReservationStatus.CANCELLED } : r)
        );
        this.actionInProgress.set(null);
        this.notificationService.showSuccess('Reservation cancelled.');
      },
      error: (err) => {
        this.actionInProgress.set(null);
        this.notificationService.showHttpError(err);
      }
    });
  }

  navigateToAccommodation(accommodationId: string): void {
    void this.router.navigate(['/accommodations', accommodationId]);
  }

  startApprove(id: string): void {
    this.approvingId.set(id);
    this.rejectingId.set(null);
  }

  startReject(id: string): void {
    this.rejectingId.set(id);
    this.approvingId.set(null);
  }

  cancelHostConfirm(): void {
    this.approvingId.set(null);
    this.rejectingId.set(null);
  }

  approveReservation(id: string): void {
    this.actionInProgress.set(id);
    this.approvingId.set(null);

    this.reservationService.approve(id).subscribe({
      next: () => {
        this.reservations.update(list =>
          list.map(r => r.id === id ? { ...r, status: ReservationStatus.APPROVED } : r)
        );
        this.actionInProgress.set(null);
        this.notificationService.showSuccess('Reservation approved.');
      },
      error: (err) => {
        this.actionInProgress.set(null);
        this.notificationService.showHttpError(err);
      }
    });
  }

  rejectReservation(id: string): void {
    this.actionInProgress.set(id);
    this.rejectingId.set(null);

    this.reservationService.reject(id).subscribe({
      next: () => {
        this.reservations.update(list =>
          list.map(r => r.id === id ? { ...r, status: ReservationStatus.REJECTED } : r)
        );
        this.actionInProgress.set(null);
        this.notificationService.showSuccess('Reservation rejected.');
      },
      error: (err) => {
        this.actionInProgress.set(null);
        this.notificationService.showHttpError(err);
      }
    });
  }

  getGuestCancellationCount(reservation: ReservationResponse | ReservationWithGuestInfoResponse): number {
    return 'guestCancellationCount' in reservation ? reservation.guestCancellationCount : 0;
  }
}
