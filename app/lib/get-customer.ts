import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function getCustomer({
  context,
}: {
  context: LoaderFunctionArgs['context'];
}) {
  const customerAccessToken = await context.session.get('customerAccessToken');

  if (!customerAccessToken) {
    return redirect('/account/login');
  }

  const {customer} = await context.storefront.query(CUSTOMER_QUERY, {
    variables: {
      customerAccessToken: customerAccessToken.accessToken,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
    cache: context.storefront.CacheNone(),
  });

  if (!customer) {
    throw new Error('Customer not found');
  }

  return customer;
}

export const CUSTOMER_FRAGMENT = `#graphql
  fragment CustomerId on Customer {
    id
  }
` as const;

const CUSTOMER_QUERY = `#graphql
  query CustomerId(
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      ...CustomerId
    }
  }
  ${CUSTOMER_FRAGMENT}
` as const;
