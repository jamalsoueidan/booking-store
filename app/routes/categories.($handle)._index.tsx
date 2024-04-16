import {Button, Flex, SimpleGrid, Stack} from '@mantine/core';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {Pagination, getPaginationVariables, parseGid} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {Wrapper} from '~/components/Wrapper';
import {TreatmentCard} from '~/components/treatment/TreatmentCard';
import {PRODUCT_ITEM_FRAGMENT} from '~/data/fragments';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import type {ProductsGetUsersImage} from '~/lib/api/model';
import {parseTE} from '~/lib/clean';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {
      title: `BySisters | ${
        parseTE(data?.collection.title || '') ?? ''
      } Kollektion`,
    },
  ];
};

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 10,
  });

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {
      handle: handle || 'alle-behandlinger',
      ...paginationVariables,
    },
  });

  const {payload: productsUsers} =
    await getBookingShopifyApi().productsGetUsersImage({
      productIds:
        collection?.products.nodes.map((p) => parseGid(p.id).id) || [],
    });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }
  return json(
    {collection, productsUsers},
    {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    },
  );
}

export default function Collection() {
  const {collection, productsUsers} = useLoaderData<typeof loader>();

  return (
    <>
      <Wrapper>
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
              <ProductsGrid products={nodes} productsUsers={productsUsers} />
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
      </Wrapper>
    </>
  );
}

function ProductsGrid({
  products,
  productsUsers,
}: {
  products: ProductItemFragment[];
  productsUsers: ProductsGetUsersImage[];
}) {
  return (
    <SimpleGrid cols={{base: 1, xs: 2, sm: 3, md: 4}} spacing="lg">
      {products.map((product, index) => {
        const productUsers = productsUsers.find(
          (p) => p.productId.toString() === parseGid(product.id).id,
        );

        return (
          <TreatmentCard
            key={product.id}
            product={product}
            productUsers={productUsers}
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
