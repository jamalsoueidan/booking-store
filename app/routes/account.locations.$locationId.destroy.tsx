import {type ActionFunction} from '@shopify/remix-oxygen';
import {redirectWithSuccess} from 'remix-toast';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {baseURL} from '~/lib/api/mutator/query-client';
import {getCustomer} from '~/lib/get-customer';

export const action: ActionFunction = async ({context, params}) => {
  const customerId = await getCustomer({context});

  await getBookingShopifyApi().customerLocationRemove(
    customerId,
    params.locationId || '',
  );

  await context.storefront.cache?.delete(
    `${baseURL}/customer/${customerId}/locations`,
  );

  return redirectWithSuccess('/account/locations', {
    message: 'Lokation er slettet!!',
  });
};
