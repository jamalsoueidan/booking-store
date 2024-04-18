/**
 * Generated by orval v6.27.1 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type { UsersFiltersPayloadAvailableDaysItem } from './usersFiltersPayloadAvailableDaysItem';
import type { UsersFiltersPayloadLocationsItem } from './usersFiltersPayloadLocationsItem';
import type { UsersFiltersPayloadProductDetailsItem } from './usersFiltersPayloadProductDetailsItem';
import type { UsersFiltersPayloadSpecialtiesItem } from './usersFiltersPayloadSpecialtiesItem';

export interface UsersFiltersPayload {
  availableDays: UsersFiltersPayloadAvailableDaysItem[];
  locations: UsersFiltersPayloadLocationsItem[];
  productDetails: UsersFiltersPayloadProductDetailsItem[];
  specialties: UsersFiltersPayloadSpecialtiesItem[];
}
