import {redirect, type ActionFunction} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';

export const action: ActionFunction = async ({context, params}) => {
  const customerId = await getCustomer({context});

  try {
    await getBookingShopifyApi().customerBlockedDestroy(
      customerId,
      params.blockedId || '',
    );

    return redirect('/business/booked');
  } catch (error) {
    return redirect('/business/booked');
  }
};
