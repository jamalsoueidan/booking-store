import {type ActionFunction} from '@shopify/remix-oxygen';
import {redirectWithSuccess} from 'remix-toast';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {baseURL} from '~/lib/api/mutator/query-client';
import {getCustomer} from '~/lib/get-customer';

export const action: ActionFunction = async ({context, params}) => {
  const customerId = await getCustomer({context});

  const {locationId} = params;
  if (!locationId) {
    throw new Error('missing locationId');
  }

  await Promise.all([
    getBookingShopifyApi().customerLocationRemove(customerId, locationId),
    context.storefront.cache?.delete(
      `${baseURL}/customer/${customerId}/location/${locationId}`,
    ),
    context.storefront.cache?.delete(
      `${baseURL}/customer/${customerId}/locations`,
    ),
  ]);

  return redirectWithSuccess('/business/locations', {
    message: 'Lokation er slettet!!',
  });
};
