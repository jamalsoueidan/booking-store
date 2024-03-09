/**
 * Generated by orval v6.25.0 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type {CustomerBaseOrderSimpleLineItem} from './customerBaseOrderSimpleLineItem';

export interface CustomerBaseOrderFulfillment {
  admin_graphql_api_id: string;
  created_at: string;
  id: number;
  line_items: CustomerBaseOrderSimpleLineItem[];
  location_id: number;
  name: string;
  order_id: number;
  service: string;
  shipment_status?: string;
  status: string;
  tracking_company?: string;
  tracking_number?: string;
  tracking_numbers?: string[];
  tracking_url?: string;
  tracking_urls?: string[];
  updated_at?: string;
}
