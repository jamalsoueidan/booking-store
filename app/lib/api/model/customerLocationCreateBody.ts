/**
 * Generated by orval v6.30.2 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type {CustomerLocationCreateBodyLocationType} from './customerLocationCreateBodyLocationType';

export interface CustomerLocationCreateBody {
  distanceForFree: number;
  distanceHourlyRate: number;
  fixedRatePerKm: number;
  fullAddress: string;
  locationType: CustomerLocationCreateBodyLocationType;
  maxDriveDistance: number;
  minDriveDistance: number;
  name: string;
  startFee: number;
}
