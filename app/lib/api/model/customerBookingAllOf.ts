/**
 * Generated by orval v6.25.0 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type { CustomerBaseOrderLineItem } from './customerBaseOrderLineItem';
import type { CustomerLocationBase } from './customerLocationBase';
import type { Shipping } from './shipping';
import type { CustomerBookingAllOfUser } from './customerBookingAllOfUser';

export type CustomerBookingAllOf = {
  end: string;
  groupId: string;
  line_items: CustomerBaseOrderLineItem[];
  location: CustomerLocationBase;
  shipping?: Shipping;
  start: string;
  title: string;
  user: CustomerBookingAllOfUser;
};
