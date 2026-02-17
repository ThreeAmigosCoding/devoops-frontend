import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  AccommodationResponse,
  AccommodationPhotoResponse,
  AvailabilityPeriodResponse,
  CreateAvailabilityPeriodRequest,
  UpdateAvailabilityPeriodRequest,
  PageResponse
} from '@core/models/accommodation.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccommodationService {
  private readonly api = inject(ApiService);

  getAll(page = 0, size = 12): Observable<PageResponse<AccommodationResponse>> {
    return this.api.get<PageResponse<AccommodationResponse>>('/accommodation', { page, size });
  }

  getById(id: string): Observable<AccommodationResponse> {
    return this.api.get<AccommodationResponse>(`/accommodation/${id}`);
  }

  getByHostId(hostId: string): Observable<AccommodationResponse[]> {
    return this.api.get<AccommodationResponse[]>(`/accommodation/host/${hostId}`);
  }

  getPhotos(accommodationId: string): Observable<AccommodationPhotoResponse[]> {
    return this.api.get<AccommodationPhotoResponse[]>(`/accommodation/${accommodationId}/photos`);
  }

  getPhotoUrl(accommodationId: string, photoId: string): string {
    return `${environment.apiUrl}/accommodation/${accommodationId}/photos/${photoId}`;
  }

  getAvailability(accommodationId: string): Observable<AvailabilityPeriodResponse[]> {
    return this.api.get<AvailabilityPeriodResponse[]>(`/accommodation/${accommodationId}/availability`);
  }

  createAvailability(accommodationId: string, request: CreateAvailabilityPeriodRequest): Observable<AvailabilityPeriodResponse> {
    return this.api.post<AvailabilityPeriodResponse>(`/accommodation/${accommodationId}/availability`, request);
  }

  updateAvailability(accommodationId: string, periodId: string, request: UpdateAvailabilityPeriodRequest): Observable<AvailabilityPeriodResponse> {
    return this.api.put<AvailabilityPeriodResponse>(`/accommodation/${accommodationId}/availability/${periodId}`, request);
  }

  deleteAvailability(accommodationId: string, periodId: string): Observable<void> {
    return this.api.delete<void>(`/accommodation/${accommodationId}/availability/${periodId}`);
  }
}
