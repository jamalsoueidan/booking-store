/**
 * Generated by orval v6.20.0 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type {CustomerProductBookingPeriod} from './customerProductBookingPeriod';
import type {CustomerProductNoticePeriod} from './customerProductNoticePeriod';

export interface CustomerProductBase {
  bookingPeriod: CustomerProductBookingPeriod;
  breakTime: number;
  description?: string;
  duration: number;
  noticePeriod: CustomerProductNoticePeriod;
  productId: number;
  variantId: number;
}
