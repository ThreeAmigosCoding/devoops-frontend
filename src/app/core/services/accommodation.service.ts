import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  AccommodationResponse,
  AccommodationPhotoResponse,
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
}
