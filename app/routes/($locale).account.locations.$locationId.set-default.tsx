import {redirect, type ActionFunction} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';

export const action: ActionFunction = async ({context, params}) => {
  const customerAccessToken = await context.session.get('customerAccessToken');
  const customer = await getCustomer({context, customerAccessToken});

  await getBookingShopifyApi().customerLocationSetDefault(
    customer.id,
    params.locationId || '',
  );

  return redirect(`/account/locations`);
};
