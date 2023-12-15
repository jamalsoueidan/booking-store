/**
 * Generated by orval v6.20.0 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type {CustomerOrderMoney} from './customerOrderMoney';
import type {CustomerOrderLineItemProperties} from './customerOrderLineItemProperties';

export interface CustomerOrderLineItem {
  admin_graphql_api_id: string;
  fulfillable_quantity: number;
  fulfillment_service: string;
  fulfillment_status?: string | null;
  gift_card: boolean;
  grams: number;
  id: number;
  name: string;
  price: string;
  price_set: CustomerOrderMoney;
  product_exists: boolean;
  product_id: number;
  properties: CustomerOrderLineItemProperties;
  quantity: number;
  requires_shipping: boolean;
  sku?: string | null;
  taxable: boolean;
  title: string;
  total_discount: string;
  total_discount_set: CustomerOrderMoney;
  variant_id: number;
  variant_inventory_management?: string | null;
  variant_title?: string | null;
  vendor?: string | null;
}
