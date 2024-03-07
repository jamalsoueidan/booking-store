import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {useLoaderData} from '@remix-run/react';
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

  const {payload: artist} = await getBookingShopifyApi().userGet(username);

  return json({
    artist,
  });
}

export default function ArtistIndex() {
  const {artist} = useLoaderData<typeof loader>();

  return (
    <ArtistPage artist={artist}>
      <ArtistHero artist={artist} />
    </ArtistPage>
  );
}
