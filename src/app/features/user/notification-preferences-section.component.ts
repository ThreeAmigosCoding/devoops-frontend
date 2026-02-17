import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NotificationPreferencesService } from '@core/services/notification-preferences.service';
import { NotificationService } from '@core/services/notification.service';
import {
  NotificationPreferencesResponse,
  UpdateNotificationPreferencesRequest
} from '@core/models/notification-preferences.model';
import { UserRole } from '@core/models/user.model';

interface ToggleDefinition {
  key: keyof UpdateNotificationPreferencesRequest;
  label: string;
  description: string;
  roles: UserRole[];
}

const TOGGLE_DEFINITIONS: ToggleDefinition[] = [
  {
    key: 'reservationRequestCreated',
    label: 'New reservation requests',
    description: 'Get notified when a guest requests a reservation',
    roles: [UserRole.HOST]
  },
  {
    key: 'reservationCancelled',
    label: 'Reservation cancellations',
    description: 'Get notified when a guest cancels a reservation',
    roles: [UserRole.HOST]
  },
  {
    key: 'hostRated',
    label: 'Host ratings',
    description: 'Get notified when a guest rates you',
    roles: [UserRole.HOST]
  },
  {
    key: 'accommodationRated',
    label: 'Accommodation reviews',
    description: 'Get notified when a guest reviews your accommodation',
    roles: [UserRole.HOST]
  },
  {
    key: 'reservationResponse',
    label: 'Reservation updates',
    description: 'Get notified when a host responds to your reservation request',
    roles: [UserRole.GUEST]
  }
];

@Component({
  selector: 'app-notification-preferences-section',
  standalone: true,
  imports: [MatSlideToggle, MatProgressSpinner],
  template: `
    <div class="preferences-section">
      <h3 class="section-title">Notification Preferences</h3>

      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="32"></mat-spinner>
        </div>
      } @else if (error()) {
        <p class="error-message">{{ error() }}</p>
      } @else if (preferences()) {
        <div class="toggle-list">
          @for (toggle of visibleToggles; track toggle.key) {
            <div class="toggle-row">
              <mat-slide-toggle
                [checked]="getPreferenceValue(toggle.key)"
                (change)="onToggleChange(toggle.key, $event.checked)">
                <span class="toggle-label">{{ toggle.label }}</span>
              </mat-slide-toggle>
              <span class="toggle-description">{{ toggle.description }}</span>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .preferences-section {
      padding-top: 0;
    }

    .section-title {
      margin: 0 0 12px;
      font-size: 16px;
      font-weight: 500;
      color: var(--mat-sys-on-surface);
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 16px 0;
    }

    .error-message {
      color: var(--mat-sys-error);
      margin: 0;
      padding: 8px;
      border-radius: 4px;
      background-color: var(--mat-sys-error-container, #fde8e8);
    }

    .toggle-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .toggle-row {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 10px 12px;
      border-radius: 8px;
      background-color: var(--mat-sys-surface-container);
    }

    .toggle-label {
      color: var(--mat-sys-on-surface);
    }

    .toggle-description {
      font-size: 12px;
      color: var(--mat-sys-on-surface-variant);
    }
  `]
})
export class NotificationPreferencesSectionComponent implements OnInit {
  @Input({ required: true }) userRole!: UserRole;

  private readonly preferencesService = inject(NotificationPreferencesService);
  private readonly notificationService = inject(NotificationService);

  preferences = signal<NotificationPreferencesResponse | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  visibleToggles: ToggleDefinition[] = [];

  ngOnInit(): void {
    this.visibleToggles = TOGGLE_DEFINITIONS.filter(t => t.roles.includes(this.userRole));

    this.preferencesService.getPreferences().subscribe({
      next: (prefs) => {
        this.preferences.set(prefs);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load notification preferences.');
        this.loading.set(false);
      }
    });
  }

  getPreferenceValue(key: keyof UpdateNotificationPreferencesRequest): boolean {
    const prefs = this.preferences();
    return prefs ? !!(prefs as any)[key] : false;
  }

  onToggleChange(key: keyof UpdateNotificationPreferencesRequest, checked: boolean): void {
    const previous = this.preferences();
    if (!previous) return;

    // Optimistic update
    this.preferences.set({ ...previous, [key]: checked });

    this.preferencesService.updatePreferences({ [key]: checked }).subscribe({
      error: (err) => {
        // Revert on failure
        this.preferences.set(previous);
        this.notificationService.showHttpError(err, 'Failed to update notification preference.');
      }
    });
  }
}
