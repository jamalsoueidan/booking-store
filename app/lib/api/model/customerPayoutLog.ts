/**
 * Generated by orval v6.28.2 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type {CustomerPayoutLogReferenceDocument} from './customerPayoutLogReferenceDocument';
import type {CustomerPayoutLogType} from './customerPayoutLogType';

export interface CustomerPayoutLog {
  _id: string;
  createdAt: string;
  customerId: number;
  orderCreatedAt: string;
  orderId: number;
  payout: string;
  referenceDocument: CustomerPayoutLogReferenceDocument;
  referenceId: string;
  referenceType: CustomerPayoutLogType;
}
