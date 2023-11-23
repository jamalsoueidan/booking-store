import {
  Button,
  Container,
  Flex,
  SimpleGrid,
  Stack,
  Title,
  rem,
} from '@mantine/core';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {
  Image,
  Money,
  Pagination,
  getPaginationVariables,
} from '@shopify/hydrogen';
import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {ProductCard} from '~/components/ProductCard';
import {PRODUCT_ITEM_FRAGMENT} from '~/data/fragments';
import {parseCT} from '~/lib/clean';
import {useVariantUrl} from '~/utils';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
};

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    return redirect('/collections');
  }

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {handle, ...paginationVariables},
  });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }
  return json({collection});
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();

  return (
    <Container fluid pt="xl">
      <Stack pt={rem(30)} pb={rem(60)} gap="xs">
        <Title order={5} c="dimmed" tt="uppercase" fw={300} ta="center">
          Kollektion / {parseCT(collection.title)}
        </Title>
        <Title order={1} size={rem(54)} fw={400} ta="center">
          {parseCT(collection.title)}
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
            <ProductsGrid products={nodes} />
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

function ProductsGrid({products}: {products: ProductItemFragment[]}) {
  return (
    <SimpleGrid cols={{base: 1, md: 3, lg: 4}}>
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

function ProductItem({
  product,
  loading,
}: {
  product: ProductItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {product.featuredImage && (
        <Image
          alt={product.featuredImage.altText || product.title}
          aspectRatio="1/1"
          data={product.featuredImage}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <h4>{product.title}</h4>
      <small>
        <Money data={product.priceRange.minVariantPrice} />
      </small>
    </Link>
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
