/**
 * Generated by orval v6.20.0 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type {CustomerOrderSimpleLineItem} from './customerOrderSimpleLineItem';

export interface CustomerOrderFulfillment {
  admin_graphql_api_id: string;
  created_at: string;
  id: number;
  line_items: CustomerOrderSimpleLineItem[];
  location_id: number;
  name: string;
  order_id: number;
  service: string;
  shipment_status?: string | null;
  status: string;
  tracking_company?: string | null;
  tracking_number?: string | null;
  tracking_numbers?: string[];
  tracking_url?: string | null;
  tracking_urls?: string[];
  updated_at?: string;
}
