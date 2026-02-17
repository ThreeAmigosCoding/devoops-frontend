import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  AccommodationResponse,
  AccommodationPhotoResponse,
  AvailabilityPeriodResponse,
  CreateAccommodationRequest,
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
  private readonly http = inject(HttpClient);

  create(request: CreateAccommodationRequest): Observable<AccommodationResponse> {
    return this.api.post<AccommodationResponse>('/accommodation', request);
  }

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

  uploadPhotos(accommodationId: string, files: File[]): Observable<AccommodationPhotoResponse[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return this.http.post<AccommodationPhotoResponse[]>(
      `${environment.apiUrl}/accommodation/${accommodationId}/photos`, formData
    );
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
