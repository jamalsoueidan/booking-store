import {Container, Flex, NativeSelect} from '@mantine/core';
import {Outlet, useLoaderData, useNavigate, useParams} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useState} from 'react';
import {VisualTeaser} from '~/components/blocks/VisualTeaser';
import {COLLECTION_ITEM_FRAGMENT} from '~/data/fragments';
import {METAFIELD_VISUAL_TEASER_QUERY} from '~/graphql/queries/Metafield';

export async function loader({context, request}: LoaderFunctionArgs) {
  const {collections} = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: {first: 20, endCursor: null},
  });

  const {metaobject: visualTeaser} = await context.storefront.query(
    METAFIELD_VISUAL_TEASER_QUERY,
    {
      variables: {
        handle: 'collections',
        type: 'visual_teaser',
      },
    },
  );

  return json(
    {collections, visualTeaser},
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=3600',
      },
    },
  );
}

export default function Collections() {
  const params = useParams();
  const {collections, visualTeaser} = useLoaderData<typeof loader>();
  const selectedCollection = collections.nodes.find(
    (c) => c.handle === params.handle,
  );

  const [value, setValue] = useState(
    selectedCollection ? selectedCollection.title : 'Alle behandlinger',
  );

  const navigate = useNavigate();
  const gotoCategoryPage = (value: string) => {
    const selectedCollection = collections.nodes.find((c) => c.title === value);

    if (selectedCollection) {
      navigate(selectedCollection.handle);
      setValue(selectedCollection.title);
    } else {
      navigate('alle-produkter');
      setValue('Alle produkter');
    }
  };

  return (
    <>
      {visualTeaser && <VisualTeaser data={visualTeaser} />}
      <Container size="xl">
        <Flex
          justify="space-between"
          gap="lg"
          direction={{base: 'column', sm: 'row'}}
        >
          <NativeSelect
            size="xl"
            value={value}
            onChange={(event) => gotoCategoryPage(event.currentTarget.value)}
            data={['Alle produkter'].concat(
              collections.nodes.map((collection) => collection.title),
            )}
          />
          <NativeSelect
            size="xl"
            data={[
              'Sortere efter: Nyeste',
              'Sortere efter: Billigst',
              'Sortere efter: Dyrest',
            ]}
          />
        </Flex>
      </Container>

      <Outlet />
    </>
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
