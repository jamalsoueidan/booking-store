import {SimpleGrid, Stack, Title} from '@mantine/core';
import {useLoaderData} from '@remix-run/react';
import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useEffect, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {ArtistCard} from '~/components/ArtistCard';
import {METAFIELD_QUERY} from '~/data/fragments';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import type {User} from '~/lib/api/model';
import {
  ProfessionSentenceTranslations,
  ProfessionTranslations,
} from './($locale).api.users.professions';

const LIMIT = '20';

export const loader = async (args: LoaderFunctionArgs) => {
  const {context, request} = args;

  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const profession = searchParams.get('profession') || undefined;

  if (!profession) {
    return redirect('../');
  }
  const speciality = searchParams.getAll('speciality');

  const {payload: users} = await getBookingShopifyApi().usersList({
    limit: LIMIT,
    profession,
    specialties: speciality.length > 0 ? speciality : undefined,
  });

  const {metaobject: components} = await context.storefront.query(
    METAFIELD_QUERY,
    {
      variables: {
        handle: 'artists',
        type: 'components',
      },
    },
  );

  return json({users, components});
};

export default function ArtistsIndex() {
  const {users} = useLoaderData<typeof loader>();
  const url = new URL(location.href);
  const profession = url.searchParams.get('profession') || undefined;

  return (
    <Stack gap="xl">
      <Title order={2}>
        <span style={{fontWeight: 500}}>
          {ProfessionTranslations[profession || '']}.
        </span>{' '}
        <span style={{color: '#666', fontWeight: 400}}>
          {ProfessionSentenceTranslations[profession || '']}
        </span>
      </Title>

      <UserList initialData={users.results} initialCursor={users.nextCursor} />
    </Stack>
  );
}

const fetchData = async (nextCursor?: string) => {
  const url = new URL(location.href);
  const profession = url.searchParams.get('profession') || undefined;
  const speciality = url.searchParams.getAll('speciality');

  const response = await getBookingShopifyApi().usersList({
    nextCursor,
    limit: LIMIT,
    profession,
    specialties: speciality.length > 0 ? speciality : undefined,
  });

  return response.payload;
};

type UserListProps = {
  initialData: User[];
  initialCursor?: string;
};

export const UserList = ({initialData, initialCursor}: UserListProps) => {
  const [data, setData] = useState(initialData);
  const [cursor, setCursor] = useState(initialCursor);
  const [hasMore, setHasMore] = useState(initialCursor !== undefined);

  const fetchMoreData = async () => {
    const {results, nextCursor} = await fetchData(cursor);
    setData((prevData) => [...prevData, ...results]);
    setCursor(nextCursor);
    setHasMore(nextCursor !== undefined);
  };

  useEffect(() => {
    setData(initialData);
    setCursor(initialCursor);
    setHasMore(initialCursor !== undefined);
  }, [initialData, initialCursor]);

  return (
    <InfiniteScroll
      dataLength={data.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<h4>Henter flere...</h4>}
    >
      <SimpleGrid spacing="lg" cols={{base: 2, sm: 3, md: 4, lg: 7}}>
        {data?.map((user) => (
          <ArtistCard artist={user} key={user.customerId} />
        ))}
      </SimpleGrid>
    </InfiniteScroll>
  );
};
