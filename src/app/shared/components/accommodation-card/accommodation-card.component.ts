import { Component, Input, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AccommodationResponse, AmenityType } from '@core/models/accommodation.model';
import { AccommodationService } from '@core/services/accommodation.service';
import { AMENITY_ICONS } from '@shared/constants/amenity-icons';

@Component({
  selector: 'app-accommodation-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './accommodation-card.component.html',
  styleUrl: './accommodation-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccommodationCardComponent implements OnInit {
  @Input({ required: true }) accommodation!: AccommodationResponse;

  private readonly router = inject(Router);
  private readonly accommodationService = inject(AccommodationService);

  photoUrl = signal<string | null>(null);
  imageLoading = signal(true);
  imageError = signal(false);

  readonly amenityIcons = AMENITY_ICONS;

  ngOnInit(): void {
    this.loadPrimaryPhoto();
  }

  private loadPrimaryPhoto(): void {
    this.accommodationService.getPhotos(this.accommodation.id).subscribe({
      next: (photos) => {
        if (photos.length > 0) {
          const primaryPhoto = photos.sort((a, b) =>
            (a.displayOrder ?? 999) - (b.displayOrder ?? 999)
          )[0];
          this.photoUrl.set(
            this.accommodationService.getPhotoUrl(this.accommodation.id, primaryPhoto.id)
          );
        } else {
          this.imageLoading.set(false);
        }
      },
      error: () => {
        this.imageLoading.set(false);
        this.imageError.set(true);
      }
    });
  }

  onImageLoad(): void {
    this.imageLoading.set(false);
  }

  onImageError(): void {
    this.imageLoading.set(false);
    this.imageError.set(true);
  }

  navigateToDetail(): void {
    this.router.navigate(['/accommodations', this.accommodation.id]);
  }

  get displayedAmenities(): AmenityType[] {
    return this.accommodation.amenities?.slice(0, 4) ?? [];
  }

  get remainingAmenitiesCount(): number {
    return Math.max(0, (this.accommodation.amenities?.length ?? 0) - 4);
  }

  get guestCapacity(): string {
    if (this.accommodation.minGuests === this.accommodation.maxGuests) {
      return `${this.accommodation.maxGuests} guests`;
    }
    return `${this.accommodation.minGuests}-${this.accommodation.maxGuests} guests`;
  }
}
