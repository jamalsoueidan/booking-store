/**
 * Generated by orval v6.25.0 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type {CustomerScheduleSlotDay} from './customerScheduleSlotDay';
import type {CustomerScheduleSlotInterval} from './customerScheduleSlotInterval';

export interface CustomerScheduleSlot {
  day: CustomerScheduleSlotDay;
  intervals: CustomerScheduleSlotInterval[];
}
