export interface NotificationPreferencesResponse {
  userId: string;
  userEmail: string;
  reservationRequestCreated: boolean;
  reservationCancelled: boolean;
  hostRated: boolean;
  accommodationRated: boolean;
  reservationResponse: boolean;
}

export interface UpdateNotificationPreferencesRequest {
  reservationRequestCreated?: boolean | null;
  reservationCancelled?: boolean | null;
  hostRated?: boolean | null;
  accommodationRated?: boolean | null;
  reservationResponse?: boolean | null;
}
