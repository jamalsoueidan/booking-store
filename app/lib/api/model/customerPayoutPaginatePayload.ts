/**
 * Generated by orval v6.25.0 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type { CustomerPayout } from './customerPayout';

export interface CustomerPayoutPaginatePayload {
  currentPage: number;
  hasNextPage: boolean;
  results: CustomerPayout[];
  totalCount: number;
  totalPages: number;
}
