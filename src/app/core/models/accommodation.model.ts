export enum AmenityType {
  WIFI = 'WIFI',
  KITCHEN = 'KITCHEN',
  AC = 'AC',
  PARKING = 'PARKING',
  FREE_PARKING = 'FREE_PARKING',
  POOL = 'POOL',
  TV = 'TV',
  WASHING_MACHINE = 'WASHING_MACHINE',
  HEATING = 'HEATING',
  BALCONY = 'BALCONY'
}

export enum PricingMode {
  PER_GUEST = 'PER_GUEST',
  PER_UNIT = 'PER_UNIT'
}

export enum ApprovalMode {
  AUTOMATIC = 'AUTOMATIC',
  MANUAL = 'MANUAL'
}

export interface AccommodationResponse {
  id: string;
  hostId: string;
  name: string;
  address: string;
  minGuests: number;
  maxGuests: number;
  pricingMode: PricingMode;
  approvalMode: ApprovalMode;
  amenities: AmenityType[];
  createdAt: string;
  updatedAt: string;
}

export interface AccommodationPhotoResponse {
  id: string;
  accommodationId: string;
  originalFilename: string;
  contentType: string;
  fileSize: number;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilityPeriodResponse {
  id: string;
  accommodationId: string;
  startDate: string;
  endDate: string;
  pricePerDay: number;
}

export interface CreateAvailabilityPeriodRequest {
  startDate: string;
  endDate: string;
  pricePerDay: number;
}

export interface UpdateAvailabilityPeriodRequest {
  startDate?: string;
  endDate?: string;
  pricePerDay?: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
