import {json, redirect, type ActionFunction} from '@shopify/remix-oxygen';

import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';

export const action: ActionFunction = async ({context, params}) => {
  try {
    const {scheduleHandle} = params;
    const customer = await getCustomer({context});

    if (scheduleHandle) {
      await getBookingShopifyApi().customerScheduleDestroy(
        customer.id,
        scheduleHandle,
      );
    }

    return redirect('../../');
  } catch (error: unknown) {
    return json(false, {status: 400});
  }
};
