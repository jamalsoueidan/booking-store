import {Link, Outlet, useLoaderData, useOutletContext} from '@remix-run/react';

import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';

export async function loader({context}: LoaderFunctionArgs) {
  const customer = await getCustomer({context});
  const response = await getBookingShopifyApi().customerStatus(customer.id);

  return json({
    status: response.payload,
  });
}

export default function AccountServices() {
  const {status} = useLoaderData<typeof loader>();
  const context = useOutletContext();

  if (!status.locations) {
    return (
      <>
        Du mangler tilføje <Link to="/account/locations">lokationer</Link>
      </>
    );
  }
  if (!status.schedules) {
    return (
      <>
        Du mangler oprette <Link to="/account/schedules">vagtplan</Link>
      </>
    );
  }
  return <Outlet context={context} />;
}
