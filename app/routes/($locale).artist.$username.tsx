import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {Container, Skeleton} from '@mantine/core';
import {Await, Outlet, useLoaderData} from '@remix-run/react';
import {Suspense} from 'react';
import {ArtistHero} from '~/components/artist/ArtistHero';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

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

  return (
    <Container fluid py="xl">
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
      <Outlet />
    </Container>
  );
}
