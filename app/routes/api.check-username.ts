import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type UserUsernameTakenResponsePayload} from '~/lib/api/model';

export async function loader({request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const username = searchParams.get('username') || '';

  const {payload: usernameTaken} =
    await getBookingShopifyApi().userUsernameTaken(username);

  return json(usernameTaken);
}

export const isUsernameUnique =
  ({request}: ActionFunctionArgs) =>
  async (username: string) => {
    const url = new URL(request.url);
    const response = await fetch(
      `${url.origin}/api/check-username?username=${username}`,
    );
    const data: UserUsernameTakenResponsePayload =
      (await response.json()) as any;
    return data.usernameTaken;
  };
