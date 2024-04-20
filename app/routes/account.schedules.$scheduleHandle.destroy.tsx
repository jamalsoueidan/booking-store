import {type ActionFunction} from '@shopify/remix-oxygen';
import {redirectWithSuccess} from 'remix-toast';

import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {baseURL} from '~/lib/api/mutator/query-client';
import {getCustomer} from '~/lib/get-customer';

export const action: ActionFunction = async ({context, params}) => {
  const {scheduleHandle} = params;
  const customerId = await getCustomer({context});

  if (!scheduleHandle) {
    throw new Error('ScheduleHandle must be defined');
  }

  await getBookingShopifyApi().customerScheduleDestroy(
    customerId,
    scheduleHandle,
  );

  await context.storefront.cache?.delete(
    `${baseURL}/customer/${customerId}/schedule/${scheduleHandle}`,
  );

  await context.storefront.cache?.delete(
    `${baseURL}/customer/${customerId}/schedules`,
  );

  return redirectWithSuccess('/account/schedules', {
    message: 'Vagtplanen er slettet!',
  });
};
