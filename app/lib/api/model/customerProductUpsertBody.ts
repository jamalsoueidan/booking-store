/**
 * Generated by orval v6.19.1 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type {CustomerProductBookingPeriod} from './customerProductBookingPeriod';
import type {CustomerProductUpsertBodyBreakTime} from './customerProductUpsertBodyBreakTime';
import type {CustomerProductUpsertBodyDuration} from './customerProductUpsertBodyDuration';
import type {CustomerProductLocations} from './customerProductLocations';
import type {CustomerProductNoticePeriod} from './customerProductNoticePeriod';
import type {CustomerProductUpsertBodyVariantId} from './customerProductUpsertBodyVariantId';

export interface CustomerProductUpsertBody {
  bookingPeriod: CustomerProductBookingPeriod;
  breakTime: CustomerProductUpsertBodyBreakTime;
  duration: CustomerProductUpsertBodyDuration;
  locations: CustomerProductLocations;
  noticePeriod: CustomerProductNoticePeriod;
  scheduleId: string;
  variantId: CustomerProductUpsertBodyVariantId;
}