/**
 * Generated by orval v6.20.0 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type {CustomerOrderRefundRefundLineItemsItem} from './customerOrderRefundRefundLineItemsItem';
import type {CustomerOrderMoney} from './customerOrderMoney';

export interface CustomerOrderRefund {
  admin_graphql_api_id: string;
  created_at: string;
  id: number;
  note?: string | null;
  order_id: number;
  processed_at: string;
  refund_line_items: CustomerOrderRefundRefundLineItemsItem[];
  restock: boolean;
  total_duties_set?: CustomerOrderMoney;
  user_id: number;
}
