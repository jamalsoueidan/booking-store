import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

export async function loader({context}: LoaderFunctionArgs) {
  const {data} = await context.customerAccount.query(CUSTOMER_DETAILS_QUERY);

  const username = convertToValidUrlPath(
    data.customer.firstName || '',
    data.customer.lastName || '',
  );

  const {payload: usernameTaken} =
    await getBookingShopifyApi().userUsernameTaken(username);

  if (usernameTaken.usernameTaken) {
    const random = Array.from(
      {length: 4},
      () => Math.floor(Math.random() * 100) + 1,
    );
    return json(`${username}-${random}`);
  }

  return json(username);
}

function convertToValidUrlPath(
  firstName: string,
  lastName: string,
  random?: boolean,
): string {
  const allowedCharactersRegex = /[^a-zA-Z0-9\-_]/g;
  firstName = firstName.replace(allowedCharactersRegex, '');
  lastName = lastName.replace(allowedCharactersRegex, '');
  const urlPath = `${firstName}-${lastName}`;
  return urlPath?.toLowerCase();
}
