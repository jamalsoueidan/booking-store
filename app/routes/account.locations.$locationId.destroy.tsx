import {type ActionFunction} from '@shopify/remix-oxygen';
import {redirectWithSuccess} from 'remix-toast';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';

export const action: ActionFunction = async ({context, params}) => {
  const customerId = await getCustomer({context});

  await getBookingShopifyApi().customerLocationRemove(
    customerId,
    params.locationId || '',
  );

  return redirectWithSuccess('/account/locations', {
    message: 'Lokation er slettet!!',
  });
};
