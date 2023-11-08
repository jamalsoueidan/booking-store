import {Outlet, useLoaderData} from '@remix-run/react';

import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';

export async function loader({context}: LoaderFunctionArgs) {
  const {session} = context;
  const customerAccessToken = await session.get('customerAccessToken');

  const customer = await getCustomer({context, customerAccessToken});
  const response = await getBookingShopifyApi().customerStatus(customer.id);

  return json({
    status: response.payload,
  });
}

export default function AccountSchedule() {
  const {status} = useLoaderData<typeof loader>();

  return <Outlet context={status} />;
}
