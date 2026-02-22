import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  CreateRatingRequest,
  RatingResponse,
  RatingsSummaryResponse,
  UpdateRatingRequest
} from '@core/models/rating.model';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private readonly api = inject(ApiService);

  create(request: CreateRatingRequest): Observable<RatingResponse> {
    return this.api.post<RatingResponse>('/rating', request);
  }

  getSummaryByTarget(targetId: string): Observable<RatingsSummaryResponse> {
    return this.api.get<RatingsSummaryResponse>(`/rating/target/${targetId}`);
  }

  getByGuest(): Observable<RatingResponse[]> {
    return this.api.get<RatingResponse[]>('/rating/guest');
  }

  update(id: string, request: UpdateRatingRequest): Observable<RatingResponse> {
    return this.api.put<RatingResponse>(`/rating/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/rating/${id}`);
  }
}
