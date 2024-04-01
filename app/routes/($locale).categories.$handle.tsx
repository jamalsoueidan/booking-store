import {Button, Flex, SimpleGrid} from '@mantine/core';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {Pagination, getPaginationVariables, parseGid} from '@shopify/hydrogen';
import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {Wrapper} from '~/components/Wrapper';
import {VisualTeaserComponent} from '~/components/blocks/VisualTeaser';
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
    <>
      <VisualTeaserComponent
        backgroundColor="grape.1"
        overtitle={`Kategori / ${parseTE(collection.title)}`}
        subtitle={collection.description}
        title={parseTE(collection.title)}
      />

      <Wrapper>
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
