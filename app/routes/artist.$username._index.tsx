import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {Flex, SimpleGrid, Skeleton, Stack, Title, rem} from '@mantine/core';
import {Await, useLoaderData} from '@remix-run/react';
import {Suspense} from 'react';
import {ArtistProduct} from '~/components/artist/ArtistProduct';
import {TextViewer} from '~/components/richtext/TextViewer';
import {ArtistCollection} from '~/graphql/artist/ArtistCollection';
import {useUser} from '~/hooks/use-user';
import type {UserProductsListByScheduleParams} from '~/lib/api/model';

export type SearchParams = {
  [key: string]: string | undefined;
} & UserProductsListByScheduleParams;

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const {username} = params;

  if (!username) {
    throw new Error('Invalid request method');
  }

  const {searchParams} = new URL(request.url);

  const collection = context.storefront.query(ArtistCollection, {
    variables: {
      handle: username,
      filters: {tag: 'treatments'},
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
