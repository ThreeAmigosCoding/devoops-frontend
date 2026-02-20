export enum ReservationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

export interface CreateReservationRequest {
  accommodationId: string;
  startDate: string;       // yyyy-MM-dd
  endDate: string;         // yyyy-MM-dd
  guestCount: number;
}

export interface ReservationResponse {
  id: string;
  accommodationId: string;
  guestId: string;
  hostId: string;
  startDate: string;
  endDate: string;
  guestCount: number;
  totalPrice: number;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ReservationWithGuestInfoResponse extends ReservationResponse {
  guestCancellationCount: number;
}
