/**
 * Generated by orval v6.27.1 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type {CustomerProductBookingPeriod} from './customerProductBookingPeriod';
import type {CustomerProductBaseCompareAtPrice} from './customerProductBaseCompareAtPrice';
import type {CustomerProductNoticePeriod} from './customerProductNoticePeriod';
import type {Items} from './items';
import type {CustomerProductBasePrice} from './customerProductBasePrice';
import type {CustomerProductSelectedOptions} from './customerProductSelectedOptions';

export interface CustomerProductBase {
  bookingPeriod: CustomerProductBookingPeriod;
  breakTime: number;
  compareAtPrice?: CustomerProductBaseCompareAtPrice;
  description?: string;
  duration: number;
  noticePeriod: CustomerProductNoticePeriod;
  options: Items[];
  price: CustomerProductBasePrice;
  productHandle?: string;
  productId: number;
  selectedOptions: CustomerProductSelectedOptions;
  variantId: number;
}
