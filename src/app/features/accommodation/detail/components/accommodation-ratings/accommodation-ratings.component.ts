import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@core/auth/services/auth.service';
import { RatingService } from '@core/services/rating.service';
import { RatingsSummaryResponse, RatingTargetType } from '@core/models/rating.model';
import { UserRole } from '@core/models/user.model';
import {
  RatingDialogComponent,
  RatingDialogData,
  RatingDialogResult
} from '@features/rating/rating-dialog.component';

@Component({
  selector: 'app-accommodation-ratings',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatButtonModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './accommodation-ratings.component.html',
  styleUrl: './accommodation-ratings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccommodationRatingsComponent implements OnInit {
  @Input({ required: true }) accommodationId!: string;
  @Input({ required: true }) hostId!: string;

  private readonly ratingService = inject(RatingService);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);

  activeTab = signal<RatingTargetType>('ACCOMMODATION');
  summary = signal<RatingsSummaryResponse | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  currentUserId = computed(() => this.authService.getCurrentUser()?.userId ?? null);
  isGuest = computed(() => this.authService.hasRole(UserRole.GUEST));

  myRating = computed(() => {
    const uid = this.currentUserId();
    return uid ? (this.summary()?.ratings.find(r => r.guestId === uid) ?? null) : null;
  });

  averageLabel = computed(() => {
    const s = this.summary();
    if (!s || s.totalCount === 0) return 'No ratings yet';
    return `${s.averageScore.toFixed(1)} ★  ·  ${s.totalCount} rating${s.totalCount === 1 ? '' : 's'}`;
  });

  ngOnInit(): void {
    this.loadRatings();
  }

  onTabChange(tab: RatingTargetType): void {
    this.activeTab.set(tab);
    this.loadRatings();
  }

  private loadRatings(): void {
    this.loading.set(true);
    this.error.set(null);

    const targetId = this.activeTab() === 'ACCOMMODATION' ? this.accommodationId : this.hostId;

    this.ratingService.getSummaryByTarget(targetId).subscribe({
      next: (data) => {
        this.summary.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load ratings.');
        this.loading.set(false);
      }
    });
  }

  openCreateDialog(): void {
    const tab = this.activeTab();
    const targetId = tab === 'ACCOMMODATION' ? this.accommodationId : this.hostId;
    const data: RatingDialogData = {
      mode: 'create',
      targetId,
      targetType: tab,
      targetName: tab === 'ACCOMMODATION' ? 'this accommodation' : 'this host'
    };

    const ref = this.dialog.open<RatingDialogComponent, RatingDialogData, RatingDialogResult>(
      RatingDialogComponent,
      { data, width: '380px' }
    );

    ref.afterClosed().subscribe(result => {
      if (result?.action === 'created') {
        this.loadRatings();
      }
    });
  }

  openViewDialog(): void {
    const rating = this.myRating();
    if (!rating) return;

    const tab = this.activeTab();
    const targetId = tab === 'ACCOMMODATION' ? this.accommodationId : this.hostId;
    const data: RatingDialogData = {
      mode: 'view',
      rating,
      targetId,
      targetType: tab
    };

    const ref = this.dialog.open<RatingDialogComponent, RatingDialogData, RatingDialogResult>(
      RatingDialogComponent,
      { data, width: '380px' }
    );

    ref.afterClosed().subscribe(result => {
      if (result?.action === 'updated' || result?.action === 'deleted') {
        this.loadRatings();
      }
    });
  }
}
