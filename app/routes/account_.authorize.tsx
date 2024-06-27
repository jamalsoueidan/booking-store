import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({context}: LoaderFunctionArgs) {
  console.log('called this before redirect');
  return context.customerAccount.authorize();
}
