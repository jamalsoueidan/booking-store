import {redirect, type ActionFunction} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {redirectWithNotification} from '~/lib/show-notification';

export const action: ActionFunction = async ({context, params}) => {
  const customer = await getCustomer({context});

  try {
    await getBookingShopifyApi().customerBlockedDestroy(
      customer.id,
      params.blockedId || '',
    );

    return redirectWithNotification(context, {
      redirectUrl: `/account/booked`,
      title: 'Ferie',
      message: 'Ferie er nu slettet!',
      color: 'red',
    });
  } catch (error) {
    return redirect('/account/booked');
  }
};
