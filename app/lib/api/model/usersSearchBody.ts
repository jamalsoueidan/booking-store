/**
 * Generated by orval v6.25.0 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type { UsersSearchBodyLocation } from './usersSearchBodyLocation';

export interface UsersSearchBody {
  days?: string[];
  keyword?: string;
  location?: UsersSearchBodyLocation;
  profession?: string;
  specialties?: string;
}