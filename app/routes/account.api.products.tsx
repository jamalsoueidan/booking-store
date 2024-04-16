import {parseGid} from '@shopify/hydrogen';
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
  const collectionId = searchParams.get('collectionId') || '';
  const limit = searchParams.get('limit');

  if (!collectionId) {
    return json([]);
  }

  const {collection} = await storefront.query(PRODUCTS_SEARCH_QUERY, {
    variables: {
      collectionId: `gid://shopify/Collection/${collectionId}`,
      first: parseInt(limit || '5'),
    },
  });

  const {payload: productIds} =
    await getBookingShopifyApi().customerProductsListIds(customerId);

  const products = collection?.products.nodes
    .filter(({id}) => !productIds.includes(parseInt(parseGid(id).id)))
    .filter((product) => product.title.toLowerCase().includes(keyword));

  return json(products);
}

const PRODUCTS_SEARCH_QUERY = `#graphql
  ${PRODUCT_SIMPLE_FRAGMENT}
  query ProductSearchQuery(
    $collectionId: ID!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
  ) @inContext(country: $country, language: $language) {
    collection(id: $collectionId) {
      products(first: $first) {
        nodes {
          ...ProductSimple
        }
      }
    }
  }
` as const;
