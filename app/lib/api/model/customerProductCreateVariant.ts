/**
 * Generated by orval v6.25.0 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type {CustomerProductCreateVariantProduct} from './customerProductCreateVariantProduct';
import type {CustomerProductSelectedOptions} from './customerProductSelectedOptions';

export interface CustomerProductCreateVariant {
  compareAtPrice: string;
  id: number;
  price: string;
  product: CustomerProductCreateVariantProduct;
  selectedOptions: CustomerProductSelectedOptions[];
  title: string;
}
