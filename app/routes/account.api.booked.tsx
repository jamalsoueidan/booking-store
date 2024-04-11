import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';

export async function loader({request, context}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const start = searchParams.get('start') || '';
  const end = searchParams.get('end') || '';

  const {payload: blocked} = await getBookingShopifyApi().customerBlockedRange(
    customerId,
    {start, end},
  );

  return json(blocked);
}
