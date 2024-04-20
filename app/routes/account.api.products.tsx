import {parseGid} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';

export async function loader({request, context}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});

  const {storefront} = context;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const keyword = searchParams.get('keyword') || '';
  const collectionId = searchParams.get('collectionId') || '';

  if (!collectionId) {
    return json([]);
  }

  const {collection} = await storefront.query(PRODUCTS_SEARCH_QUERY, {
    variables: {
      collectionId: `gid://shopify/Collection/${collectionId}`,
      first: 50,
    },
  });

  const {payload: productIds} =
    await getBookingShopifyApi().customerProductsListIds(customerId);

  const products = collection?.products.nodes
    .filter(({id}) => !productIds.includes(parseInt(parseGid(id).id)))
    .filter((product) => product.title.toLowerCase().includes(keyword));

  return json(products);
}

export const PRODUCT_SEARCH_SIMPLE_FRAGMENT = `#graphql
  fragment ProductSearchSimple on Product {
    id
    title
    handle
  }
` as const;

const PRODUCTS_SEARCH_QUERY = `#graphql
  ${PRODUCT_SEARCH_SIMPLE_FRAGMENT}
  query ProductSearchQuery(
    $collectionId: ID!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
  ) @inContext(country: $country, language: $language) {
    collection(id: $collectionId) {
      products(first: $first) {
        nodes {
          ...ProductSearchSimple
        }
      }
    }
  }
` as const;
