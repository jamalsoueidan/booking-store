import {
  Button,
  Container,
  Flex,
  SimpleGrid,
  Stack,
  Title,
  rem,
} from '@mantine/core';
import {useLoaderData} from '@remix-run/react';
import {Pagination, getPaginationVariables} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {CollectionFragment} from 'storefrontapi.generated';
import {TreatmentCollectionCard} from '~/components/treatment/TreatmentCollectionCard';
import {COLLECTION_ITEM_FRAGMENT} from '~/data/fragments';

export async function loader({context, request}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 6,
  });

  const {collections} = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: paginationVariables,
  });

  return json({collections});
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <Container fluid pt="xl">
      <Stack pt={rem(30)} pb={rem(60)} gap="xs">
        <Title order={5} c="dimmed" tt="uppercase" fw={300} ta="center">
          KATEGORIUDVALG
        </Title>
        <Title order={1} size={rem(54)} fw={400} ta="center">
          Udforsk behandlinger, og book din tid – alt sammen på ét sted.
        </Title>
        <Title order={3} c="dimmed" ta="center" fw={300}>
          Vælg din næste skønhedsoplevelse.
        </Title>
      </Stack>

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
  );
}

function CollectionsGrid({collections}: {collections: CollectionFragment[]}) {
  return (
    <SimpleGrid cols={{base: 1, md: 3, sm: 2}}>
      {collections.map((collection, index) => (
        <TreatmentCollectionCard
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
  query StoreTreatment(
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
      query: "title:treatments:*"
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
