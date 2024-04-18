/**
 * Generated by orval v6.27.1 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type { CustomerPayoutPayoutDetails } from './customerPayoutPayoutDetails';
import type { CustomerPayoutAccountType } from './customerPayoutAccountType';
import type { CustomerPayoutStatus } from './customerPayoutStatus';

export interface CustomerPayout {
  _id?: string;
  amount: number;
  currencyCode: string;
  date: string;
  payoutDetails?: CustomerPayoutPayoutDetails;
  payoutType?: CustomerPayoutAccountType;
  status: CustomerPayoutStatus;
}
