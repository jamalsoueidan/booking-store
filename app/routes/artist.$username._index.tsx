import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {
  Button,
  Flex,
  SimpleGrid,
  Skeleton,
  Stack,
  Title,
  rem,
} from '@mantine/core';
import {Await, Link, useLoaderData} from '@remix-run/react';
import {Suspense} from 'react';
import {type ArtistCollectionFiltersFragment} from 'storefrontapi.generated';
import {ArtistProduct} from '~/components/artist/ArtistProduct';
import {TextViewer} from '~/components/richtext/TextViewer';
import {ArtistCollection} from '~/graphql/artist/ArtistCollection';
import {useUser} from '~/hooks/use-user';

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const {username} = params;

  if (!username) {
    throw new Response('username handler not defined', {
      status: 404,
    });
  }

  const {searchParams} = new URL(request.url);
  const type = searchParams.get('type');

  const collection = context.storefront.query(ArtistCollection, {
    variables: {
      handle: username,
      filters: [
        {tag: 'treatments'},
        {
          productMetafield: {
            namespace: 'booking',
            key: 'hide_from_profile',
            value: 'false',
          },
        },
        ...(type ? [{productType: type}] : []),
      ],
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  return defer({
    collection,
  });
}

export default function ArtistIndex() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <Suspense fallback={<Skeleton height={8} radius="xl" />}>
      <Await resolve={data.collection}>
        {({collection}) => (
          <Flex direction="column" gap={{base: 'md', sm: 'xl'}}>
            {collection ? (
              <ArtistSchedulesMenu
                filters={collection.products.filters as any}
              />
            ) : null}
            <SimpleGrid cols={{base: 1, md: 2}} spacing="lg">
              {collection?.products.nodes.map((product) => (
                <ArtistProduct key={product.id} product={product} />
              ))}
            </SimpleGrid>
            {user.aboutMe ? (
              <Stack gap="xs" mt="xl">
                <Title size={rem(28)}>Om mig</Title>
                <TextViewer content={user.aboutMe} />
              </Stack>
            ) : null}
          </Flex>
        )}
      </Await>
    </Suspense>
  );
}

function ArtistSchedulesMenu({
  filters,
}: {
  filters: ArtistCollectionFiltersFragment[];
}) {
  const user = useUser();
  const query = decodeURI(location.search);

  return (
    <Flex gap={{base: 'sm', sm: 'lg'}} justify="center" align="center">
      <Button
        size="lg"
        radius="lg"
        variant={location.search === '' ? 'filled' : 'light'}
        color={location.search === '' ? 'black' : user.theme}
        component={Link}
        to="?"
        data-testid="schedule-button-all"
      >
        Alle
      </Button>
      {filters
        .filter((f) => f.label === 'Produkttype')
        .map((f) =>
          f.values.map((v) => {
            return (
              <Button
                size="lg"
                key={v.label}
                radius="lg"
                variant={query.includes(v.label) ? 'filled' : 'light'}
                color={query.includes(v.label) ? 'black' : user.theme}
                component={Link}
                to={`?type=${v.label}`}
                data-testid={`schedule-button-${f.label.toLowerCase()}`}
              >
                {v.label}
              </Button>
            );
          }),
        )}
    </Flex>
  );
}
