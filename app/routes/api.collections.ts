import {json, type LoaderFunctionArgs} from '@remix-run/server-runtime';

export async function loader({context, request}: LoaderFunctionArgs) {
  const {collections} = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: {first: 250, query: '-Subcategory AND -User AND -Alle'},
  });

  return json(collections);
}

const COLLECTIONS_QUERY = `#graphql
  fragment JsonCollection on Collection {
    id
    title
  }

  query JsonCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $query: String!
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor,
      query: $query,
      sortKey: TITLE
    ) {
      nodes {
        ...JsonCollection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;
