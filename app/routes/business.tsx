import tiptapStyles from '@mantine/tiptap/styles.css?url';
import {
  Outlet,
  useLoaderData,
  type ShouldRevalidateFunction,
} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {type CustomerFragment} from 'customer-accountapi.generated';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type User} from '~/lib/api/model';

export function links() {
  return [{rel: 'stylesheet', href: tiptapStyles}];
}
export type AccountOutlet = {
  customer: CustomerFragment;
  user?: User | null;
  isBusiness: boolean;
};

export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  if (formMethod && formMethod !== 'GET') {
    return true;
  }

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) {
    return true;
  }

  return false;
};

export async function loader({context, request}: LoaderFunctionArgs) {
  const {data, errors} = await context.customerAccount.query(
    CUSTOMER_DETAILS_QUERY,
  );

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  if (!data.customer.tags.includes('business')) {
    return redirect('/account');
  }

  const {payload} = await getBookingShopifyApi().customerGet(
    parseGid(data.customer.id).id,
  );

  return json({
    customer: data.customer,
    user: payload,
  });
}

export default function Acccount() {
  const {customer, user} = useLoaderData<typeof loader>();

  return (
    <>
      <Outlet context={{customer, user}} />
    </>
  );
}
