/**
 * Generated by orval v6.25.0 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type {CustomerPayoutAccountCustomerId} from './customerPayoutAccountCustomerId';
import type {CustomerPayoutAccountPayoutDetails} from './customerPayoutAccountPayoutDetails';
import type {CustomerPayoutAccountType} from './customerPayoutAccountType';

export interface CustomerPayoutAccount {
  customerId: CustomerPayoutAccountCustomerId;
  payoutDetails: CustomerPayoutAccountPayoutDetails;
  payoutType: CustomerPayoutAccountType;
}