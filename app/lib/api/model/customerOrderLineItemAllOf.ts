/**
 * Generated by orval v6.30.2 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type {CustomerLocationBase} from './customerLocationBase';
import type {Shipping} from './shipping';
import type {User} from './user';

export type CustomerOrderLineItemAllOf = {
  location: CustomerLocationBase;
  shipping?: Shipping;
  user: User;
};
