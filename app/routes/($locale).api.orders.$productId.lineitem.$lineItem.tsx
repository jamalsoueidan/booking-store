import {parseGid} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {type ProductFragment} from 'storefrontapi.generated';
import {PRODUCT_SELECTED_OPTIONS_QUERY_ID} from '~/data/queries';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type CustomerOrderGetLineItem} from '~/lib/api/model';

import {getCustomer} from '~/lib/get-customer';

export type ApiOrdersLineItem = {
  product: ProductFragment;
  order: CustomerOrderGetLineItem;
};

export async function loader({params, context}: LoaderFunctionArgs) {
  const customer = await getCustomer({context});

  const lineItem = params.lineItem || '';
  const productId = params.productId || '';

  const {payload: order} =
    await getBookingShopifyApi().customerOrderGetLineItem(
      parseGid(customer.id).id,
      lineItem,
    );

  const {product} = await context.storefront.query(
    PRODUCT_SELECTED_OPTIONS_QUERY_ID,
    {
      variables: {
        Id: `gid://shopify/Product/${productId}`,
        selectedOptions: order.line_items.selectedOptions,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    },
  );

  return json({
    product,
    order,
  });
}
