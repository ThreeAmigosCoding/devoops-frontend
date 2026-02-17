import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { AmenityType } from '@core/models/accommodation.model';
import { AMENITY_ICONS } from '@shared/constants/amenity-icons';

@Component({
  selector: 'app-amenities-list',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatIconModule],
  templateUrl: './amenities-list.component.html',
  styleUrl: './amenities-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AmenitiesListComponent {
  @Input({ required: true }) amenities!: AmenityType[];

  readonly amenityIcons = AMENITY_ICONS;
}
