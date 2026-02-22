import { Component, Inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RatingService } from '@core/services/rating.service';
import { RatingResponse, RatingTargetType } from '@core/models/rating.model';
import { NotificationService } from '@core/services/notification.service';
import {MatTooltip} from "@angular/material/tooltip";

export interface RatingDialogData {
  mode: 'create' | 'view';
  rating?: RatingResponse;
  targetId: string;
  targetType: RatingTargetType;
  targetName?: string;
}

export interface RatingDialogResult {
  action: 'created' | 'updated' | 'deleted';
  rating?: RatingResponse;
}

@Component({
  selector: 'app-rating-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltip
  ],
  template: `
    <h2 mat-dialog-title>
      {{ data.mode === 'create' ? 'Rate ' + (data.targetName ?? data.targetType) : 'Your Rating' }}
    </h2>

    <mat-dialog-content>
      <div class="star-picker">
        @for (n of scores; track n) {
          <button
            mat-icon-button
            [class.star-filled]="n <= displayScore()"
            [class.star-empty]="n > displayScore()"
            (mouseenter)="hoverScore.set(n)"
            (mouseleave)="hoverScore.set(0)"
            (click)="selectedScore.set(n)"
            type="button">
            <mat-icon>{{ n <= displayScore() ? 'star' : 'star_border' }}</mat-icon>
          </button>
        }
      </div>
    </mat-dialog-content>

    <mat-dialog-actions>
      @if (!confirmingDelete()) {
        @if (data.mode === 'view') {
          <button mat-icon-button color="warn" 
                  [disabled]="submitting"
                  [matTooltip]="'Delete Rating'"
                  (click)="confirmingDelete.set(true)">
            <mat-icon>delete</mat-icon>
          </button>
        }

        <span class="spacer"></span>
        <button
          mat-icon-button
          color="primary"
          [disabled]="selectedScore() === 0 || submitting || (data.mode === 'view' && selectedScore() === data.rating!.score)"
          (click)="submit()"
          [matTooltip]="'Save'"
        >
          @if (submitting) {
            <mat-spinner diameter="18"></mat-spinner>
          } @else {
            <mat-icon>{{ data.mode === 'create' ? 'check' : 'save' }}</mat-icon>
          }
        </button>
      } @else {
        <span class="confirm-text">Are you sure?</span>
        <span class="spacer"></span>
        <button mat-flat-button color="warn" [disabled]="submitting" (click)="confirmDelete()">
          @if (submitting) {
            <mat-spinner diameter="18"></mat-spinner>
          } @else {
            Yes
          }
        </button>
        <button mat-stroked-button [disabled]="submitting" (click)="confirmingDelete.set(false)">No</button>
      }
    </mat-dialog-actions>
  `,
  styles: [`
    :host ::ng-deep mat-dialog-content {
      overflow: hidden;
    }

    .star-picker {
      display: flex;
      justify-content: center;
      gap: 4px;
      padding-top: 0.5rem;
      overflow: hidden;
    }

    .star-picker button {
      --mdc-icon-button-icon-size: 32px;
      width: 48px;
      height: 48px;
    }

    .star-filled {
      color: var(--mat-sys-accent-default);
    }

    .star-empty {
      color: var(--mat-sys-outline, #bbb);
    }

    .spacer {
      flex: 1 1 auto;
    }

    .confirm-text {
      font-size: 0.875rem;
      color: var(--mat-sys-on-surface-variant, #666);
      margin-right: 0.25rem;
    }
  `]
})
export class RatingDialogComponent {
  readonly scores = [1, 2, 3, 4, 5];
  selectedScore = signal<number>(0);
  hoverScore = signal<number>(0);
  displayScore = computed(() => this.hoverScore() || this.selectedScore());
  confirmingDelete = signal(false);
  submitting = false;

  constructor(
    private dialogRef: MatDialogRef<RatingDialogComponent>,
    private ratingService: RatingService,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: RatingDialogData
  ) {
    this.selectedScore.set(data.rating?.score ?? 0);
  }

  submit(): void {
    if (this.selectedScore() === 0 || this.submitting) return;

    this.submitting = true;

    if (this.data.mode === 'create') {
      this.ratingService.create({
        targetId: this.data.targetId,
        targetType: this.data.targetType,
        score: this.selectedScore()
      }).subscribe({
        next: (rating) => {
          this.notificationService.showSuccess('Rating submitted');
          const result: RatingDialogResult = { action: 'created', rating };
          this.dialogRef.close(result);
        },
        error: (err) => {
          this.submitting = false;
          this.notificationService.showHttpError(err, 'Failed to submit rating');
        }
      });
    } else {
      const id = this.data.rating!.id;
      this.ratingService.update(id, { score: this.selectedScore() }).subscribe({
        next: (rating) => {
          this.notificationService.showSuccess('Rating updated');
          const result: RatingDialogResult = { action: 'updated', rating };
          this.dialogRef.close(result);
        },
        error: (err) => {
          this.submitting = false;
          this.notificationService.showHttpError(err, 'Failed to update rating');
        }
      });
    }
  }

  confirmDelete(): void {
    if (this.submitting) return;
    this.submitting = true;

    this.ratingService.delete(this.data.rating!.id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Rating deleted');
        const result: RatingDialogResult = { action: 'deleted' };
        this.dialogRef.close(result);
      },
      error: (err) => {
        this.submitting = false;
        this.notificationService.showHttpError(err, 'Failed to delete rating');
      }
    });
  }
}
