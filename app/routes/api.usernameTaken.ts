import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type UserUsernameTakenResponsePayload} from '~/lib/api/model';

export async function loader({request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const username = searchParams.get('username') || '';

  const {payload: usernameTaken} =
    username.length > 0
      ? await getBookingShopifyApi().userUsernameTaken(username)
      : {
          payload: {usernameTaken: true} as UserUsernameTakenResponsePayload,
        };

  return json(usernameTaken);
}
