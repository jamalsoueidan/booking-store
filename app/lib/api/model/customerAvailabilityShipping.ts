/**
 * Generated by orval v6.19.1 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type {CustomerAvailabilityShippingDestination} from './customerAvailabilityShippingDestination';
import type {CustomerAvailabilityShippingDistance} from './customerAvailabilityShippingDistance';
import type {CustomerAvailabilityShippingDuration} from './customerAvailabilityShippingDuration';
import type {CustomerAvailabilityShippingOrigin} from './customerAvailabilityShippingOrigin';

export type CustomerAvailabilityShipping = {
  _id: string;
  cost: number;
  destination: CustomerAvailabilityShippingDestination;
  distance: CustomerAvailabilityShippingDistance;
  duration: CustomerAvailabilityShippingDuration;
  location?: string;
  origin: CustomerAvailabilityShippingOrigin;
};
