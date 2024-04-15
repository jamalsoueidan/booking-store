import {redirect, type ActionFunction} from '@shopify/remix-oxygen';
import {redirectWithToast} from 'remix-toast';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';

export const action: ActionFunction = async ({context, params}) => {
  const customerId = await getCustomer({context});

  try {
    await getBookingShopifyApi().customerBlockedDestroy(
      customerId,
      params.blockedId || '',
    );

    return redirectWithToast('/account/booked', {
      message: 'Ferie er nu slettet!',
      type: 'success',
    });
  } catch (error) {
    return redirect('/account/booked');
  }
};
