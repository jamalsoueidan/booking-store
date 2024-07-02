import {redirect, type ActionFunction} from '@shopify/remix-oxygen';
import {redirectWithSuccess} from 'remix-toast';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';

export const action: ActionFunction = async ({context, params}) => {
  const customerId = await getCustomer({context});

  try {
    await getBookingShopifyApi().customerBlockedDestroy(
      customerId,
      params.blockedId || '',
    );

    return redirectWithSuccess('/business/booked', {
      message: 'Ferie er nu slettet!',
    });
  } catch (error) {
    return redirect('/business/booked');
  }
};
