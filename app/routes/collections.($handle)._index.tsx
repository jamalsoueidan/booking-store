import {Button, Container, Flex, SimpleGrid, Stack} from '@mantine/core';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {Pagination, getPaginationVariables} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {ProductCard} from '~/components/ProductCard';
import {PRODUCT_ITEM_FRAGMENT} from '~/data/fragments';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `BySisters | ${data?.collection.title ?? ''} Kollektion`}];
};

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 10,
  });

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {handle: handle || 'alle-produkter', ...paginationVariables},
  });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }
  return json(
    {collection},
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=3600',
      },
    },
  );
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();

  return (
    <Container size="xl">
      <Pagination connection={collection.products}>
        {({nodes, isLoading, PreviousLink, NextLink}) => (
          <Stack gap="xl">
            <Flex justify="center">
              <Button
                variant="default"
                component={PreviousLink}
                loading={isLoading}
                size="xl"
              >
                ↑ Hent tidligere
              </Button>
            </Flex>
            <ProductsGrid products={nodes} />
            <Flex justify="center">
              <Button
                variant="default"
                component={NextLink}
                loading={isLoading}
                size="xl"
              >
                Hent flere ↓
              </Button>
            </Flex>
          </Stack>
        )}
      </Pagination>
    </Container>
  );
}

function ProductsGrid({products}: {products: ProductItemFragment[]}) {
  return (
    <SimpleGrid cols={{base: 2, xs: 3, sm: 4, md: 5}}>
      {products.map((product, index) => {
        return (
          <ProductCard
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
        );
      })}
    </SimpleGrid>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        sortKey: TITLE
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
