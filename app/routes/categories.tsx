import {Button, Container, Flex, NativeSelect} from '@mantine/core';
import {
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useNavigate,
  useParams,
} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useState} from 'react';
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
  const params = useParams();
  const {collections, visualTeaser} = useLoaderData<typeof loader>();
  const selectedCollection = collections.nodes.find(
    (c) => c.handle === params.handle,
  );

  const [value, setValue] = useState(
    selectedCollection
      ? parseTE(selectedCollection.title)
      : 'Alle behandlinger',
  );

  const navigate = useNavigate();
  const gotoCategoryPage = (value: string) => {
    const selectedCollection = collections.nodes.find(
      (c) => parseTE(c.title) === value,
    );

    if (selectedCollection) {
      navigate(selectedCollection.handle);
      setValue(parseTE(selectedCollection.title));
    } else {
      navigate('alle-behandlinger');
      setValue('Alle behandlinger');
    }
  };

  return (
    <>
      <VisualTeaser component={visualTeaser} />
      <Container size="xl">
        <Flex hiddenFrom="sm">
          <NativeSelect
            size="xl"
            value={value}
            onChange={(event) => gotoCategoryPage(event.currentTarget.value)}
            data={['Alle behandlinger'].concat(
              collections.nodes.map((collection) => parseTE(collection.title)),
            )}
            w="100%"
          />
        </Flex>
        <Flex justify="center" gap="lg" visibleFrom="sm">
          <Button
            variant="filled"
            color={
              params.handle === 'alle-behandlinger' || !params.handle
                ? 'orange'
                : 'gray.2'
            }
            c={
              params.handle === 'alle-behandlinger' || !params.handle
                ? 'white'
                : 'gray.7'
            }
            radius="xl"
            size="lg"
            component={Link}
            to="/categories"
          >
            Alle behandlinger
          </Button>

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
                  size="lg"
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
