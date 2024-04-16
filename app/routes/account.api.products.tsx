import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {PRODUCT_SIMPLE_FRAGMENT} from '~/data/fragments';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';

export async function loader({request, context}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});

  const {storefront} = context;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const keyword = searchParams.get('keyword') || '';
  const collection = searchParams.get('collection') || '';
  const excludeCreated = searchParams.get('excludeCreated');
  const limit = searchParams.get('limit');

  const query = ['treatments'];

  if (excludeCreated === 'true') {
    const {payload: productIds} =
      await getBookingShopifyApi().customerProductsListIds(customerId);

    productIds.forEach((id) => query.push(`-${id}`));
  }

  if (keyword) {
    query.push(keyword);
  }

  if (collection) {
    query.push(collection);
  }

  const products = await storefront.query(PRODUCTS_SEARCH_QUERY, {
    variables: {
      query: query.join(' AND '),
      first: parseInt(limit || '5'),
    },
  });

  return json(products);
}

const PRODUCTS_SEARCH_QUERY = `#graphql
  ${PRODUCT_SIMPLE_FRAGMENT}
  query ProductSearchQuery(
    $query: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first,
      sortKey: TITLE,
      query: $query
    ) {
      nodes {
        ...ProductSimple
      }
    }
  }
` as const;
