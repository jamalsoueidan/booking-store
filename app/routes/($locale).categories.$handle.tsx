import {
  Button,
  Container,
  Flex,
  SimpleGrid,
  Stack,
  Title,
  rem,
} from '@mantine/core';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {Pagination, getPaginationVariables, parseGid} from '@shopify/hydrogen';
import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {ProductItemFragment} from 'storefrontapi.generated';
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
      } Collection`,
    },
  ];
};

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 10,
  });

  if (!handle) {
    return redirect('/collections');
  }

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {handle, ...paginationVariables},
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
  return json({collection, productsUsers});
}

export default function Collection() {
  const {collection, productsUsers} = useLoaderData<typeof loader>();

  return (
    <Container fluid pt="xl">
      <Stack pt={rem(30)} pb={rem(60)} gap="xs">
        <Title order={5} c="dimmed" tt="uppercase" fw={300} ta="center">
          Kategori / {parseTE(collection.title)}
        </Title>
        <Title order={1} size={rem(54)} fw={400} ta="center">
          {parseTE(collection.title)}
        </Title>
        <Title order={3} c="dimmed" ta="center" fw={300}>
          {collection.description}
        </Title>
      </Stack>

      <Pagination connection={collection.products}>
        {({nodes, isLoading, PreviousLink, NextLink}) => (
          <>
            <Flex justify="center">
              <Button component={PreviousLink} loading={isLoading}>
                ↑ Hent tidligere
              </Button>
            </Flex>
            <ProductsGrid products={nodes} productsUsers={productsUsers} />
            <br />
            <Flex justify="center">
              <Button component={NextLink} loading={isLoading}>
                Hent flere ↓
              </Button>
            </Flex>
          </>
        )}
      </Pagination>
    </Container>
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
    <SimpleGrid cols={{base: 1, md: 4}} spacing="lg">
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
        after: $endCursor
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
