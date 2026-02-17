import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AccommodationService } from '@core/services/accommodation.service';
import { NotificationService } from '@core/services/notification.service';
import { CreateAccommodationRequest, PricingMode, ApprovalMode, AmenityType } from '@core/models/accommodation.model';
import { AMENITY_ICONS } from '@shared/constants/amenity-icons';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-accommodation-create',
  standalone: true,
  imports: [
    FormsModule, MatFormField, MatLabel, MatError, MatInput, MatButton, MatIconButton,
    MatSelect, MatOption, MatCheckbox, MatIcon, MatProgressSpinner
  ],
  templateUrl: './accommodation-create.component.html',
  styleUrl: './accommodation-create.component.scss'
})
export class AccommodationCreateComponent {
  private readonly accommodationService = inject(AccommodationService);
  private readonly dialogRef = inject(MatDialogRef<AccommodationCreateComponent>);
  private readonly notificationService = inject(NotificationService);

  PricingMode = PricingMode;
  ApprovalMode = ApprovalMode;
  amenityTypes = Object.values(AmenityType);
  AMENITY_ICONS = AMENITY_ICONS;

  submitting = false;
  selectedFiles: File[] = [];
  previewUrls: string[] = [];

  formData: CreateAccommodationRequest = {
    name: '',
    address: '',
    minGuests: 1,
    maxGuests: 1,
    pricingMode: PricingMode.PER_UNIT,
    approvalMode: ApprovalMode.MANUAL,
    amenities: []
  };

  toggleAmenity(amenity: AmenityType): void {
    const index = this.formData.amenities.indexOf(amenity);
    if (index >= 0) {
      this.formData.amenities.splice(index, 1);
    } else {
      this.formData.amenities.push(amenity);
    }
  }

  hasAmenity(amenity: AmenityType): boolean {
    return this.formData.amenities.includes(amenity);
  }

  get guestsInvalid(): boolean {
    return this.formData.minGuests > this.formData.maxGuests;
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      this.selectedFiles.push(file);
      this.previewUrls.push(URL.createObjectURL(file));
    }

    input.value = '';
  }

  removeFile(index: number): void {
    URL.revokeObjectURL(this.previewUrls[index]);
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  onSubmit(): void {
    if (this.guestsInvalid || this.submitting) return;

    this.submitting = true;

    const create$ = this.accommodationService.create(this.formData);

    if (this.selectedFiles.length > 0) {
      create$.pipe(
        switchMap(accommodation =>
          this.accommodationService.uploadPhotos(accommodation.id, this.selectedFiles).pipe(
            switchMap(() => [accommodation])
          )
        )
      ).subscribe({
        next: (accommodation) => {
          this.notificationService.showSuccess('Accommodation created successfully!');
          this.dialogRef.close(accommodation);
        },
        error: (error) => {
          this.submitting = false;
          this.notificationService.showHttpError(error, 'Failed to create accommodation.');
        }
      });
    } else {
      create$.subscribe({
        next: (accommodation) => {
          this.notificationService.showSuccess('Accommodation created successfully!');
          this.dialogRef.close(accommodation);
        },
        error: (error) => {
          this.submitting = false;
          this.notificationService.showHttpError(error, 'Failed to create accommodation.');
        }
      });
    }
  }

  onCancel(): void {
    this.previewUrls.forEach(url => URL.revokeObjectURL(url));
    this.dialogRef.close();
  }
}
