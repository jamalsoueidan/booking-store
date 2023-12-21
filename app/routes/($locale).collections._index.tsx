import {Box, Button, Container, Flex, SimpleGrid} from '@mantine/core';
import {Link, useLoaderData} from '@remix-run/react';
import {Image, Pagination, getPaginationVariables} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {CollectionFragment} from 'storefrontapi.generated';
import {CollectionCard} from '~/components/CollectionCard';
import {IndexTitle} from '~/components/index/IndexTitle';
import {IndexTopBackground} from '~/components/index/IndexTopBackground';
import {COLLECTION_ITEM_FRAGMENT} from '~/data/fragments';
import {parseCT} from '~/lib/clean';

export async function loader({context, request}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  const {collections} = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: paginationVariables,
  });

  return json({collections});
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <>
      <IndexTopBackground bg="orange.1" mb="70">
        <IndexTitle
          overtitle="Kollektioner"
          subtitle="Køb produkter hos os som vi bruger"
        >
          Køb produkter hos os som vi bruger.
        </IndexTitle>
      </IndexTopBackground>

      <Box my="xl">
        <Container size="lg">
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
        </Container>
      </Box>
    </>
  );
}

function CollectionsGrid({collections}: {collections: CollectionFragment[]}) {
  return (
    <Container>
      <SimpleGrid cols={{base: 1, sm: 2}} spacing="xl">
        {collections.map((collection, index) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            index={index}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
}

function CollectionItem({
  collection,
  index,
}: {
  collection: CollectionFragment;
  index: number;
}) {
  return (
    <Link
      className="collection-item"
      key={collection.id}
      to={`/collections/${collection.handle}`}
      prefetch="intent"
    >
      {collection?.image && (
        <Image
          alt={collection.image.altText || collection.title}
          aspectRatio="1/1"
          data={collection.image}
          loading={index < 3 ? 'eager' : undefined}
        />
      )}
      <h5>{parseCT(collection.title)}</h5>
    </Link>
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
      query: "title:products:*"
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
