import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {USER_METAOBJECT_QUERY} from '~/graphql/fragments/UserMetaobject';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const username = searchParams.get('username') || '';
  if (username.length <= 3) return true;

  const {metaobject: user} = await storefront.query(USER_METAOBJECT_QUERY, {
    variables: {
      username,
    },
    cache: context.storefront.CacheShort(),
  });

  return json(user !== null);
}

export const isUsernameUnique =
  ({request}: ActionFunctionArgs) =>
  async (username: string) => {
    const url = new URL(request.url);
    const response = await fetch(
      `${url.origin}/api/check-username?username=${username}`,
    );
    const data = await response.json();
    return data as boolean;
  };
