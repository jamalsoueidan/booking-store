/**
 * Generated by orval v6.20.0 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type {CustomerAvailabilityCustomer} from './customerAvailabilityCustomer';
import type {CustomerAvailabilityShipping} from './customerAvailabilityShipping';
import type {CustomerAvailabilitySlotsItem} from './customerAvailabilitySlotsItem';

export interface CustomerAvailability {
  customer: CustomerAvailabilityCustomer;
  date: string;
  shipping?: CustomerAvailabilityShipping;
  slots: CustomerAvailabilitySlotsItem[];
}
