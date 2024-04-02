import {Button, Container, Flex} from '@mantine/core';
import {NavLink, Outlet, useLoaderData} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {VisualTeaser} from '~/components/blocks/VisualTeaser';
import {COLLECTION_ITEM_FRAGMENT, METAFIELD_QUERY} from '~/data/fragments';
import {parseTE} from '~/lib/clean';

export async function loader({context, request}: LoaderFunctionArgs) {
  const {collections} = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: {first: 20, endCursor: null},
  });

  const {metaobject: visualTeaser} = await context.storefront.query(
    METAFIELD_QUERY,
    {
      variables: {
        handle: 'categories',
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
      <Container size="xl">
        <Flex justify="center" gap="md">
          <NavLink to="/categories">
            {({isActive}) => (
              <Button
                variant="filled"
                color={isActive ? 'orange' : 'gray.2'}
                c={isActive ? 'white' : 'gray.7'}
                radius="xl"
              >
                Alle behandlinger
              </Button>
            )}
          </NavLink>
          {collections.nodes.map((collection) => (
            <NavLink
              key={collection.id}
              to={`/categories/${collection.handle}`}
            >
              {({isActive}) => (
                <Button
                  variant="filled"
                  color={isActive ? 'orange' : 'gray.2'}
                  c={isActive ? 'white' : 'gray.7'}
                  radius="xl"
                >
                  {parseTE(collection.title)}
                </Button>
              )}
            </NavLink>
          ))}
        </Flex>
      </Container>

      <Outlet />
    </>
  );
}

export const COLLECTIONS_QUERY = `#graphql
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
      sortKey: TITLE,
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
