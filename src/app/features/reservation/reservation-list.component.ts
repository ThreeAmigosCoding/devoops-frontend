import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '@core/auth/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { ReservationService } from '@core/services/reservation.service';
import { AccommodationService } from '@core/services/accommodation.service';
import { UserService } from '@core/services/user.service';
import { ReservationResponse, ReservationStatus } from '@core/models/reservation.model';
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
  private readonly accommodationService = inject(AccommodationService);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  reservations = signal<ReservationResponse[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  confirmingId = signal<string | null>(null);
  actionInProgress = signal<string | null>(null);
  accommodationNames = signal<Map<string, string>>(new Map());
  guestNames = signal<Map<string, string>>(new Map());

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
        this.fetchNames(data);
      },
      error: (err) => {
        this.error.set('Failed to load reservations. Please try again.');
        this.loading.set(false);
        console.error('Error loading reservations:', err);
      }
    });
  }

  private fetchNames(reservations: ReservationResponse[]): void {
    const accommodationIds = [...new Set(reservations.map(r => r.accommodationId))];
    const accommodationRequests = Object.fromEntries(
      accommodationIds.map(id => [id, this.accommodationService.getById(id).pipe(catchError(() => of(null)))])
    );

    const guestIds = this.isHost
      ? [...new Set(reservations.map(r => r.guestId))]
      : [];
    const guestRequests = Object.fromEntries(
      guestIds.map(id => [id, this.userService.getById(id).pipe(catchError(() => of(null)))])
    );

    const allRequests = { ...accommodationRequests, ...guestRequests };
    if (Object.keys(allRequests).length === 0) {
      this.loading.set(false);
      return;
    }

    forkJoin(allRequests).subscribe({
      next: results => {
        const accMap = new Map<string, string>();
        for (const id of accommodationIds) {
          const acc = results[id] as { name?: string } | null;
          if (acc?.name) accMap.set(id, acc.name);
        }
        this.accommodationNames.set(accMap);

        const guestMap = new Map<string, string>();
        for (const id of guestIds) {
          const user = results[id] as { firstName?: string; lastName?: string } | null;
          if (user?.firstName) guestMap.set(id, `${user.firstName} ${user.lastName}`);
        }
        this.guestNames.set(guestMap);
      },
      complete: () => this.loading.set(false)
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
}
