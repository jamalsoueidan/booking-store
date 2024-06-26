/**
 * Generated by orval v6.30.2 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type {CustomerProductBookingPeriod} from './customerProductBookingPeriod';
import type {CustomerProductUpdateBodyCompareAtPrice} from './customerProductUpdateBodyCompareAtPrice';
import type {CustomerProductLocations} from './customerProductLocations';
import type {CustomerProductNoticePeriod} from './customerProductNoticePeriod';
import type {CustomerProductUpdateBodyPrice} from './customerProductUpdateBodyPrice';

export interface CustomerProductUpdateBody {
  bookingPeriod?: CustomerProductBookingPeriod;
  breakTime?: number;
  compareAtPrice?: CustomerProductUpdateBodyCompareAtPrice;
  description?: string;
  descriptionHtml?: string;
  duration?: number;
  hideFromCombine?: string;
  hideFromProfile?: string;
  locations?: CustomerProductLocations;
  noticePeriod?: CustomerProductNoticePeriod;
  price?: CustomerProductUpdateBodyPrice;
  productType?: string;
  title?: string;
}
