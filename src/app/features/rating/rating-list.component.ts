import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { RatingService } from '@core/services/rating.service';
import { RatingResponse, RatingTargetType } from '@core/models/rating.model';
import {
  RatingDialogComponent,
  RatingDialogData,
  RatingDialogResult
} from './rating-dialog.component';

@Component({
  selector: 'app-rating-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    DatePipe,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './rating-list.component.html',
  styleUrl: './rating-list.component.scss'
})
export class RatingListComponent implements OnInit {
  private readonly ratingService = inject(RatingService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  ratings = signal<RatingResponse[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  selectedType = signal<RatingTargetType | 'ALL'>('ALL');

  filteredRatings = computed(() => {
    const type = this.selectedType();
    const list = type === 'ALL'
      ? this.ratings()
      : this.ratings().filter(r => r.targetType === type);
    return [...list].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

  ngOnInit(): void {
    this.loadRatings();
  }

  loadRatings(): void {
    this.loading.set(true);
    this.error.set(null);

    this.ratingService.getByGuest().subscribe({
      next: (data) => {
        this.ratings.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load ratings. Please try again.');
        this.loading.set(false);
      }
    });
  }

  navigateToAccommodation(accommodationId: string, event: Event): void {
    event.stopPropagation();
    void this.router.navigate(['/accommodations', accommodationId]);
  }

  openViewDialog(rating: RatingResponse): void {
    const data: RatingDialogData = {
      mode: 'view',
      rating,
      targetId: rating.targetId,
      targetType: rating.targetType
    };

    const ref = this.dialog.open<RatingDialogComponent, RatingDialogData, RatingDialogResult>(
      RatingDialogComponent,
      { data, width: '380px' }
    );

    ref.afterClosed().subscribe(result => {
      if (result?.action === 'updated' && result.rating) {
        this.ratings.update(list =>
          list.map(r => r.id === rating.id ? result.rating! : r)
        );
      } else if (result?.action === 'deleted') {
        this.ratings.update(list => list.filter(r => r.id !== rating.id));
      }
    });
  }
}
