import {json, type ActionFunction} from '@shopify/remix-oxygen';
import {redirectWithToast} from 'remix-toast';

import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';

export const action: ActionFunction = async ({context, params}) => {
  try {
    const {scheduleHandle} = params;
    const customerId = await getCustomer({context});

    if (!scheduleHandle) {
      throw new Error('ScheduleHandle must be defined');
    }

    await getBookingShopifyApi().customerScheduleDestroy(
      customerId,
      scheduleHandle,
    );

    return redirectWithToast('/account/schedules', {
      message: 'Vagtplanen er slettet!',
      type: 'success',
    });
  } catch (error: unknown) {
    return json(false, {status: 400});
  }
};
