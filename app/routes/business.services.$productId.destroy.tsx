import {redirect, type ActionFunction} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {baseURL} from '~/lib/api/mutator/query-client';
import {getCustomer} from '~/lib/get-customer';

export const action: ActionFunction = async ({context, params}) => {
  const {productId} = params;
  if (!productId) {
    throw new Response('Missing productId param', {status: 404});
  }

  const customerId = await getCustomer({context});

  await getBookingShopifyApi().customerProductDestroy(customerId, productId);

  await context.storefront.cache?.delete(
    `${baseURL}/customer/${customerId}/products`,
  );

  await context.storefront.cache?.delete(
    `${baseURL}/customer/${customerId}/product/${productId}`,
  );

  return redirect('/business/services');
};
