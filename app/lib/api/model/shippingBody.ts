/**
 * Generated by orval v6.25.0 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type {ShippingBodyDestination} from './shippingBodyDestination';

export interface ShippingBody {
  customerId?: number;
  destination: ShippingBodyDestination;
  locationId: string;
}
