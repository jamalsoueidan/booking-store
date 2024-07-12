import tiptapStyles from '@mantine/tiptap/styles.css?url';
import {
  Outlet,
  type ShouldRevalidateFunction,
  useLoaderData,
} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {type CustomerFragment} from 'customer-accountapi.generated';
import {useEffect} from 'react';
import notify, {Toaster} from 'react-hot-toast';
import {getToast} from 'remix-toast';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import {type User} from '~/lib/api/model';

export function links() {
  return [{rel: 'stylesheet', href: tiptapStyles}];
}

export const handle: Handle = {
  i18n: ['global', 'account', 'professions', 'zod'],
};

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

  const {toast} = await getToast(request);

  return json(
    {
      customer: data.customer,
      toast,
    },
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Set-Cookie': await context.session.commit(),
      },
    },
  );
}

export default function Acccount() {
  const {customer, toast} = useLoaderData<typeof loader>();

  useEffect(() => {
    if (toast) {
      switch (toast.type) {
        case 'success':
          notify.success(toast.message);
          return;
        case 'error':
          notify.error(toast.message);

          return;
        default:
          return;
      }
    }
  }, [toast]);

  return (
    <>
      <Outlet context={{customer}} />
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{duration: 3000, className: 'toast', id: 'toast'}}
      />
    </>
  );
}
