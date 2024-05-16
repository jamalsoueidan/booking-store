import {Button, Flex, SimpleGrid, Stack} from '@mantine/core';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {
  UNSTABLE_Analytics as Analytics,
  Pagination,
  getPaginationVariables,
} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {TreatmentCard} from '~/components/treatment/TreatmentCard';
import {Wrapper} from '~/components/Wrapper';
import {TreatmentCollectionFragment} from '~/graphql/fragments/TreatmentCollection';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {
      title: `BySisters | ${data?.collection.title ?? ''}`,
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
            <SimpleGrid cols={{base: 1, xs: 2, sm: 3, md: 4}} spacing="lg">
              {nodes.map((product) => {
                return <TreatmentCard key={product.id} product={product} />;
              })}
            </SimpleGrid>
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
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </Wrapper>
  );
}

const COLLECTION_QUERY = `#graphql
  ${TreatmentCollectionFragment}
  query Collectionss(
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
          ...TreatmentCollection
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
