/**
 * Generated by orval v6.28.2 🍺
 * Do not edit manually.
 * Booking Shopify Api
 * OpenAPI spec version: 1.0.0
 */
import type {CustomerBaseOrderSimpleLineItem} from './customerBaseOrderSimpleLineItem';
import type {CustomerBaseOrderRefundRefundLineItemsItemSubtotal} from './customerBaseOrderRefundRefundLineItemsItemSubtotal';
import type {CustomerBaseOrderMoney} from './customerBaseOrderMoney';
import type {CustomerBaseOrderRefundRefundLineItemsItemTotalTax} from './customerBaseOrderRefundRefundLineItemsItemTotalTax';

export type CustomerBaseOrderRefundRefundLineItemsItem = {
  id: number;
  line_item: CustomerBaseOrderSimpleLineItem;
  line_item_id: number;
  location_id: number;
  quantity: number;
  restock_type: string;
  subtotal: CustomerBaseOrderRefundRefundLineItemsItemSubtotal;
  subtotal_set: CustomerBaseOrderMoney;
  total_tax?: CustomerBaseOrderRefundRefundLineItemsItemTotalTax;
  total_tax_set?: CustomerBaseOrderMoney;
};
