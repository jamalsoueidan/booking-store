/**
 * Generated by orval v6.30.2 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type {CustomerLocationAllOfGeoLocation} from './customerLocationAllOfGeoLocation';

export type CustomerLocationAllOf = {
  _id: string;
  distanceForFree: number;
  distanceHourlyRate: number;
  fixedRatePerKm: number;
  geoLocation: CustomerLocationAllOfGeoLocation;
  maxDriveDistance: number;
  minDriveDistance: number;
  startFee: number;
};
