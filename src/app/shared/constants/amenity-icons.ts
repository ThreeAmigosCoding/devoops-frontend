import { AmenityType } from '@core/models/accommodation.model';

export const AMENITY_ICONS: Record<AmenityType, { icon: string; label: string }> = {
  [AmenityType.WIFI]: { icon: 'wifi', label: 'WiFi' },
  [AmenityType.KITCHEN]: { icon: 'kitchen', label: 'Kitchen' },
  [AmenityType.AC]: { icon: 'ac_unit', label: 'Air Conditioning' },
  [AmenityType.PARKING]: { icon: 'local_parking', label: 'Parking' },
  [AmenityType.FREE_PARKING]: { icon: 'local_parking', label: 'Free Parking' },
  [AmenityType.POOL]: { icon: 'pool', label: 'Pool' },
  [AmenityType.TV]: { icon: 'tv', label: 'TV' },
  [AmenityType.WASHING_MACHINE]: { icon: 'local_laundry_service', label: 'Washing Machine' },
  [AmenityType.HEATING]: { icon: 'thermostat', label: 'Heating' },
  [AmenityType.BALCONY]: { icon: 'balcony', label: 'Balcony' }
};
