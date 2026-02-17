import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  NotificationPreferencesResponse,
  UpdateNotificationPreferencesRequest
} from '@core/models/notification-preferences.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationPreferencesService {
  private readonly api = inject(ApiService);

  getPreferences(): Observable<NotificationPreferencesResponse> {
    return this.api.get<NotificationPreferencesResponse>('/notification/preferences');
  }

  updatePreferences(request: UpdateNotificationPreferencesRequest): Observable<NotificationPreferencesResponse> {
    return this.api.put<NotificationPreferencesResponse>('/notification/preferences', request);
  }
}
