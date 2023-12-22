import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {Flex, Skeleton} from '@mantine/core';
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
    <Flex direction={isMobile ? 'column' : 'row'} mih="100vh">
      <div
        style={{
          backgroundColor: 'rgb(168, 139, 248)',
          ...(!isMobile && {flex: '0 0 30%'}),
        }}
      >
        <div
          style={{
            padding: isMobile ? '1rem' : '2rem',
            ...(!isMobile && {position: 'sticky', top: 0, padding: '3rem'}),
          }}
        >
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
        </div>
      </div>
      <Outlet />
    </Flex>
  );
}
