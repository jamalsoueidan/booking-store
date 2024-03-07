import {redirect, type ActionFunction} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';

export const action: ActionFunction = async ({context, params}) => {
  const customer = await getCustomer({context});

  await getBookingShopifyApi().customerLocationRemove(
    customer.id,
    params.locationId || '',
  );

  return redirect(`/account/locations`);
};
