/**
 * Generated by orval v6.20.0 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type {CustomerOrderClient} from './customerOrderClient';
import type {CustomerOrderMoney} from './customerOrderMoney';
import type {CustomerOrderCustomer} from './customerOrderCustomer';
import type {CustomerOrderFulfillment} from './customerOrderFulfillment';
import type {CustomerOrderRefund} from './customerOrderRefund';
import type {CustomerOrderAddress} from './customerOrderAddress';
import type {CustomerOrderShipping} from './customerOrderShipping';

export interface CustomerOrder {
  admin_graphql_api_id: string;
  buyer_accepts_marketing: boolean;
  cancel_reason?: string | null;
  cancelled_at?: string;
  client_details?: CustomerOrderClient;
  closed_at?: string | null;
  confirmed: boolean;
  contact_email?: string | null;
  created_at: string;
  currency: string;
  current_subtotal_price: string;
  current_subtotal_price_set: CustomerOrderMoney;
  current_total_additional_fees_set?: CustomerOrderMoney;
  current_total_discounts: string;
  current_total_discounts_set: CustomerOrderMoney;
  current_total_duties_set?: CustomerOrderMoney;
  current_total_price: string;
  current_total_price_set: CustomerOrderMoney;
  current_total_tax: string;
  current_total_tax_set: CustomerOrderMoney;
  customer: CustomerOrderCustomer;
  end: string;
  fulfillments: CustomerOrderFulfillment[];
  id: number;
  order_number: number;
  refunds: CustomerOrderRefund[];
  shipping_address?: CustomerOrderAddress;
  shipping_lines: CustomerOrderShipping[];
  start: string;
  title: string;
}
