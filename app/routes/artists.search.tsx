import {
  Box,
  Button,
  Container,
  Flex,
  rem,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  useLoaderData,
  useNavigate,
  useParams,
  useSearchParams,
} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconSearch} from '@tabler/icons-react';
import {useEffect, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {H2} from '~/components/titles/H2';
import {METAFIELD_QUERY} from '~/data/fragments';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import type {User} from '~/lib/api/model';
import {
  ProfessionSentenceTranslations,
  ProfessionTranslations,
} from './api.users.professions';
import {UserCard} from './artists._index';

const LIMIT = '20';

export const loader = async (args: LoaderFunctionArgs) => {
  const {context, request, params} = args;

  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const speciality = searchParams.getAll('speciality');
  const profession = searchParams.get('profession') || undefined;
  const keyword = searchParams.get('keyword') || undefined;
  const days = searchParams.getAll('days') || undefined;
  const location = searchParams.get('location') || undefined;
  const locationType = searchParams.get('locationType') || undefined;

  const {payload: users} = await getBookingShopifyApi().usersSearch(
    {
      profession,
      specialties: speciality.length > 0 ? speciality.join(',') : undefined,
      keyword,
      days,
      ...(location && locationType
        ? {location: {city: location, locationType}}
        : {location: undefined}),
    },
    {
      limit: LIMIT,
    },
  );

  const {metaobject: components} = await context.storefront.query(
    METAFIELD_QUERY,
    {
      variables: {
        handle: 'artists',
        type: 'components',
      },
    },
  );

  return json(
    {users, components},
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=3600',
      },
    },
  );
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
  const response = await getBookingShopifyApi().usersSearch(
    {
      profession,
      specialties: speciality.length > 0 ? speciality.join(',') : undefined,
    },
    {
      nextCursor: cursor,
      limit: LIMIT,
    },
  );

  return response.payload;
};

type UserListProps = {
  initialData: User[];
  initialCursor?: string;
};

export const UserList = ({initialData, initialCursor}: UserListProps) => {
  const navigate = useNavigate();
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

  const reset = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('keyword');
    newSearchParams.delete('days');
    newSearchParams.delete('location');
    newSearchParams.delete('locationType');
    navigate(`/artists/search?${newSearchParams.toString()}`);
  };

  if (data.length === 0) {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const location = newSearchParams.get('location');
    const profession = newSearchParams.get('profession') || '';
    const keyword = newSearchParams.get('keyword') || '';
    return (
      <Flex direction="column" justify="center" align="center" gap="md">
        <IconSearch style={{width: rem(64), height: rem(64)}} stroke="1" />
        <Title fw="500">Ingen resultater fundet</Title>
        <Text c="dimmed">
          {ProfessionTranslations[profession]}, {location}, {keyword}
        </Text>
        <Button onClick={reset}>Nulstille søgning</Button>
      </Flex>
    );
  }

  return (
    <InfiniteScroll
      dataLength={data.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<h4>Henter flere...</h4>}
      hasChildren={data.length === 0}
    >
      <SimpleGrid spacing="lg" cols={{base: 2, sm: 3, md: 4, lg: 5}}>
        {data?.map((user) => {
          return <UserCard user={user} key={user.username} />;
        })}
      </SimpleGrid>
    </InfiniteScroll>
  );
};
