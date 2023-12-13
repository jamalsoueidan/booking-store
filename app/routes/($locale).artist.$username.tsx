import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {Container, Grid, Skeleton} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {Await, Outlet, useLoaderData} from '@remix-run/react';
import {Suspense} from 'react';
import {ArtistHero} from '~/components/artist/ArtistHero';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

export function shouldRevalidate() {
  return false;
}

export async function loader({params}: LoaderFunctionArgs) {
  const {username} = params;

  if (!username) {
    throw new Error('Invalid request method');
  }

  const artist = getBookingShopifyApi().userGet(username);

  return defer({
    artist,
  });
}

export default function ArtistIndex() {
  const data = useLoaderData<typeof loader>();
  const isMobile = useMediaQuery('(max-width: 62em)');

  return (
    <Container fluid py="xl">
      <Grid columns={12} gutter={{base: 'xl'}} grow>
        <Grid.Col span={isMobile ? 12 : 3}>
          <Suspense
            fallback={
              <div>
                <Skeleton height={50} circle mb="xl" />
                <Skeleton height={8} radius="xl" />
                <Skeleton height={8} mt={6} radius="xl" />
              </div>
            }
          >
            <Await resolve={data.artist}>
              {({payload: artist}) => <ArtistHero artist={artist} />}
            </Await>
          </Suspense>
        </Grid.Col>
        <Grid.Col span={{base: 12, md: 8}}>
          <Outlet />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
