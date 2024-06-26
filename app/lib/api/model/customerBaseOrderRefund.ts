/**
 * Generated by orval v6.30.2 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type {CustomerBaseOrderRefundRefundLineItemsItem} from './customerBaseOrderRefundRefundLineItemsItem';
import type {CustomerBaseOrderMoney} from './customerBaseOrderMoney';

export interface CustomerBaseOrderRefund {
  admin_graphql_api_id: string;
  created_at: string;
  id: number;
  note?: string;
  order_id: number;
  processed_at: string;
  refund_line_items: CustomerBaseOrderRefundRefundLineItemsItem[];
  restock: boolean;
  /** @nullable */
  total_duties_set?: CustomerBaseOrderMoney;
  user_id: number;
}
