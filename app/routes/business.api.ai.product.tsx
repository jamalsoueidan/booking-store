import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

export async function loader({request, context}: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const title = searchParams.get('title');

  if (!title) {
    return null;
  }

  const response = await getBookingShopifyApi().openAIProductTitle({
    title,
  });

  return json(response.payload);
}
