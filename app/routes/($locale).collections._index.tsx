import {Button, Flex, SimpleGrid} from '@mantine/core';
import {useLoaderData} from '@remix-run/react';
import {Pagination, getPaginationVariables} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {type CollectionFragment} from 'storefrontapi.generated';
import {CollectionCard} from '~/components/CollectionCard';
import {Wrapper} from '~/components/Wrapper';
import {VisualTeaser} from '~/components/metaobjects/VisualTeaser';
import {COLLECTION_ITEM_FRAGMENT, METAFIELD_QUERY} from '~/data/fragments';

export async function loader({context, request}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  const {collections} = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: paginationVariables,
  });

  const {metaobject: visualTeaser} = await context.storefront.query(
    METAFIELD_QUERY,
    {
      variables: {
        handle: 'collections',
        type: 'visual_teaser',
      },
    },
  );

  return json({collections, visualTeaser});
}

export default function Collections() {
  const {collections, visualTeaser} = useLoaderData<typeof loader>();

  return (
    <>
      <VisualTeaser component={visualTeaser} />

      <Wrapper>
        <Pagination connection={collections}>
          {({nodes, isLoading, PreviousLink, NextLink}) => (
            <>
              <Flex justify="center">
                <Button component={PreviousLink} loading={isLoading}>
                  ↑ Hent tidligere
                </Button>
              </Flex>
              <CollectionsGrid collections={nodes} />
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

function CollectionsGrid({collections}: {collections: CollectionFragment[]}) {
  return (
    <SimpleGrid cols={{base: 1, sm: 2}} spacing="xl">
      {collections.map((collection, index) => (
        <CollectionCard
          key={collection.id}
          collection={collection}
          index={index}
        />
      ))}
    </SimpleGrid>
  );
}

const COLLECTIONS_QUERY = `#graphql
  ${COLLECTION_ITEM_FRAGMENT}
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor,
      query: "title:products:*",
      sortKey: TITLE
    ) {
      nodes {
        ...Collection
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
