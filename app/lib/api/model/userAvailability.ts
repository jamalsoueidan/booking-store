/**
 * Generated by orval v6.28.2 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type {UserAvailabilityCustomer} from './userAvailabilityCustomer';
import type {Shipping} from './shipping';

export interface UserAvailability {
  customer: UserAvailabilityCustomer;
  date: string;
  shipping?: Shipping;
}
