/**
 * Generated by orval v6.19.1 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type {CustomerLocationGeoLocation} from './customerLocationGeoLocation';
import type {CustomerLocationLocationType} from './customerLocationLocationType';
import type {CustomerLocationMaxDriveDistance} from './customerLocationMaxDriveDistance';
import type {CustomerLocationMinDriveDistance} from './customerLocationMinDriveDistance';
import type {CustomerLocationOriginType} from './customerLocationOriginType';
import type {CustomerLocationStartFee} from './customerLocationStartFee';

export interface CustomerLocation {
  _id: string;
  customerId: string;
  distanceForFree: number;
  distanceHourlyRate: number;
  fixedRatePerKm: number;
  fullAddress: string;
  geoLocation: CustomerLocationGeoLocation;
  locationType: CustomerLocationLocationType;
  maxDriveDistance: CustomerLocationMaxDriveDistance;
  minDriveDistance: CustomerLocationMinDriveDistance;
  name: string;
  originType: CustomerLocationOriginType;
  startFee?: CustomerLocationStartFee;
}