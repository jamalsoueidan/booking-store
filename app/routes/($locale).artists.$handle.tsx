import {Box, Container, rem, SimpleGrid, Stack} from '@mantine/core';
import {useLoaderData, useParams, useSearchParams} from '@remix-run/react';
import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useEffect, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {ArtistCard} from '~/components/ArtistCard';
import {H2} from '~/components/titles/H2';
import {METAFIELD_QUERY} from '~/data/fragments';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import type {User} from '~/lib/api/model';
import {ProfessionSentenceTranslations} from './($locale).api.users.professions';

const LIMIT = '20';

export const loader = async (args: LoaderFunctionArgs) => {
  const {context, request, params} = args;
  const {handle} = params;

  if (!handle) {
    return redirect('../');
  }
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const speciality = searchParams.getAll('speciality');

  const {payload: users} = await getBookingShopifyApi().usersList({
    limit: LIMIT,
    profession: handle,
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
  const params = useParams();
  const {handle: profession} = params;

  return (
    <Box py={{base: rem(40), sm: rem(60)}}>
      <Container size="xl">
        <Stack gap="xl">
          <H2
            gradients={{from: '#9030ed', to: '#e71b7c'}}
            fz={{base: rem(30), sm: rem(40)}}
            lh={{base: rem(40), sm: rem(50)}}
          >
            {ProfessionSentenceTranslations[profession || '']}
          </H2>

          <UserList
            initialData={users.results}
            initialCursor={users.nextCursor}
          />
        </Stack>
      </Container>
    </Box>
  );
}

const fetchData = async ({
  profession,
  speciality,
  cursor,
}: {
  profession: string;
  speciality: string[];
  cursor?: string;
}) => {
  const response = await getBookingShopifyApi().usersList({
    nextCursor: cursor,
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
  const [searchParams] = useSearchParams();
  const params = useParams();

  const fetchMoreData = async () => {
    const {results, nextCursor} = await fetchData({
      profession: params.profession || '',
      speciality: searchParams.getAll('speciality'),
      cursor,
    });
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
      <SimpleGrid spacing="lg" cols={{base: 2, sm: 3, md: 4, lg: 5}}>
        {data?.map((user) => (
          <ArtistCard artist={user} key={user.customerId} />
        ))}
      </SimpleGrid>
    </InfiniteScroll>
  );
};
