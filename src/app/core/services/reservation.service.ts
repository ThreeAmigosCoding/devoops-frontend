import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  CreateReservationRequest,
  ReservationResponse,
  ReservationWithGuestInfoResponse
} from '@core/models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly api = inject(ApiService);

  create(request: CreateReservationRequest): Observable<ReservationResponse> {
    return this.api.post<ReservationResponse>('/reservation', request);
  }

  getByGuest(): Observable<ReservationResponse[]> {
    return this.api.get<ReservationResponse[]>('/reservation/guest');
  }

  getByHost(): Observable<ReservationWithGuestInfoResponse[]> {
    return this.api.get<ReservationWithGuestInfoResponse[]>('/reservation/host');
  }

  getById(id: string): Observable<ReservationResponse> {
    return this.api.get<ReservationResponse>(`/reservation/${id}`);
  }

  deleteRequest(id: string): Observable<void> {
    return this.api.delete<void>(`/reservation/${id}`);
  }

  cancel(id: string): Observable<void> {
    return this.api.post<void>(`/reservation/${id}/cancel`, {});
  }

  approve(id: string): Observable<ReservationResponse> {
    return this.api.put<ReservationResponse>(`/reservation/${id}/approve`, {});
  }

  reject(id: string): Observable<ReservationResponse> {
    return this.api.put<ReservationResponse>(`/reservation/${id}/reject`, {});
  }
}
