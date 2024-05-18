/**
 * Generated by orval v6.28.2 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type {CustomerProductBookingPeriod} from './customerProductBookingPeriod';
import type {CustomerProductBaseCompareAtPrice} from './customerProductBaseCompareAtPrice';
import type {CustomerProductNoticePeriod} from './customerProductNoticePeriod';
import type {Items} from './items';
import type {CustomerProductBasePrice} from './customerProductBasePrice';

export interface CustomerProductBase {
  bookingPeriod: CustomerProductBookingPeriod;
  breakTime: number;
  compareAtPrice: CustomerProductBaseCompareAtPrice;
  description: string;
  descriptionHtml: string;
  duration: number;
  hideFromCombine: boolean;
  hideFromProfile: boolean;
  noticePeriod: CustomerProductNoticePeriod;
  options: Items[];
  price: CustomerProductBasePrice;
  productHandle?: string;
  productId: number;
  title?: string;
  variantId: number;
}
