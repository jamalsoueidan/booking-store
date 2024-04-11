import {parseGid} from '@shopify/hydrogen';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';

export async function getCustomer({
  context,
}: {
  context: LoaderFunctionArgs['context'];
}) {
  await context.customerAccount.handleAuthStatus();

  const {data, errors} = await context.customerAccount.query(
    CUSTOMER_DETAILS_QUERY,
  );

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return parseGid(data.customer.id).id;
}
