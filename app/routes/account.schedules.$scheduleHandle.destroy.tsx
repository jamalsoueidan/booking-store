import {json, redirect, type ActionFunction} from '@shopify/remix-oxygen';

import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {setNotification} from '~/lib/show-notification';

export const action: ActionFunction = async ({context, params}) => {
  try {
    const {scheduleHandle} = params;
    const customer = await getCustomer({context});

    if (scheduleHandle) {
      setNotification(context, {
        title: 'Vagtplan',
        message: 'Vagtplanen er slettet!',
        color: 'red',
      });

      await getBookingShopifyApi().customerScheduleDestroy(
        customer.id,
        scheduleHandle,
      );
    }

    return redirect('/account/schedules/', {
      headers: {
        'Set-Cookie': await context.session.commit(),
      },
    });
  } catch (error: unknown) {
    return json(false, {status: 400});
  }
};
