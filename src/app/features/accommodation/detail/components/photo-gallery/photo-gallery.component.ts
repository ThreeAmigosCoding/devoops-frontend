import { Component, Input, signal, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AccommodationPhotoResponse } from '@core/models/accommodation.model';
import { AccommodationService } from '@core/services/accommodation.service';

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './photo-gallery.component.html',
  styleUrl: './photo-gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoGalleryComponent {
  @Input({ required: true }) photos!: AccommodationPhotoResponse[];
  @Input({ required: true }) accommodationId!: string;
  @Input({ required: true }) accommodationService!: AccommodationService;

  selectedIndex = signal(0);
  imageLoadStates = signal<Record<string, boolean>>({});

  get mainPhoto(): AccommodationPhotoResponse | null {
    return this.photos[this.selectedIndex()] ?? null;
  }

  get thumbnailPhotos(): AccommodationPhotoResponse[] {
    return this.photos.slice(0, 5);
  }

  getPhotoUrl(photo: AccommodationPhotoResponse): string {
    return this.accommodationService.getPhotoUrl(this.accommodationId, photo.id);
  }

  selectPhoto(index: number): void {
    this.selectedIndex.set(index);
  }

  onImageLoad(photoId: string): void {
    this.imageLoadStates.update(states => ({ ...states, [photoId]: true }));
  }

  onImageError(photoId: string): void {
    this.imageLoadStates.update(states => ({ ...states, [photoId]: true }));
  }

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft' && this.selectedIndex() > 0) {
      this.selectedIndex.update(i => i - 1);
    } else if (event.key === 'ArrowRight' && this.selectedIndex() < this.photos.length - 1) {
      this.selectedIndex.update(i => i + 1);
    }
  }
}
