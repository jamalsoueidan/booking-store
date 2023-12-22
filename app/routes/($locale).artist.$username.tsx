import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {Skeleton} from '@mantine/core';
import {Await, useLoaderData} from '@remix-run/react';
import {Suspense} from 'react';
import {ArtistHero} from '~/components/artist/ArtistHero';
import ArtistPage from '~/components/artist/ArtistPage';
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

  return (
    <ArtistPage>
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
    </ArtistPage>
  );
}
