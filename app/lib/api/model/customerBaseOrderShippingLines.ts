/**
 * Generated by orval v6.28.2 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type {PriceSet} from './priceSet';
import type {CustomerBaseOrderShippingLinesPriceSet} from './customerBaseOrderShippingLinesPriceSet';

export interface CustomerBaseOrderShippingLines {
  carrier_identifier?: string;
  code?: string;
  discounted_price: string;
  discounted_price_set: PriceSet;
  id: number;
  phone?: string;
  price: string;
  price_set: CustomerBaseOrderShippingLinesPriceSet;
  requested_fulfillment_service_id?: string;
  source: string;
  title: string;
}
