/**
 * Generated by orval v6.25.0 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type {CustomerLocationBaseLocationType} from './customerLocationBaseLocationType';
import type {CustomerLocationBaseOriginType} from './customerLocationBaseOriginType';

export interface CustomerLocationBase {
  customerId: string;
  fullAddress: string;
  locationType: CustomerLocationBaseLocationType;
  name: string;
  originType: CustomerLocationBaseOriginType;
}
