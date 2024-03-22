import {Box, Flex, SimpleGrid, Stack, Title, rem} from '@mantine/core';
import {useLoaderData} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {ArtistCard} from '~/components/ArtistCard';
import {ProfessionButton} from '~/components/ProfessionButton';
import {METAFIELD_QUERY} from '~/data/fragments';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import type {User} from '~/lib/api/model';
import {loader as loaderProfessions} from './($locale).api.professions';
const LIMIT = '25';

export const loader = async (args: LoaderFunctionArgs) => {
  const {context} = args;
  const response = await loaderProfessions(args);
  const professions = await response.json();

  const {payload} = await getBookingShopifyApi().usersList({limit: LIMIT});

  const {metaobject: visualTeaser} = await context.storefront.query(
    METAFIELD_QUERY,
    {
      variables: {
        handle: 'artists',
        type: 'visual_teaser',
      },
    },
  );

  return json({users: payload, visualTeaser, professions});
};

export default function Collections() {
  const {users, visualTeaser, professions} = useLoaderData<typeof loader>();

  return (
    <>
      <Box
        bg={'yellow.1'}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '70px',
        }}
      ></Box>

      <Box mx={{base: 'md', sm: 'xl'}} my="xl">
        <Stack gap={rem(64)}>
          <Stack gap="xl">
            <Title order={2} fw="normal">
              <span style={{fontWeight: 500}}>Vælg en ekspert.</span>{' '}
              <span style={{color: '#666', fontWeight: 400}}>
                Book en session. Nyd og slap af med professionel service.
              </span>
            </Title>
            <Flex gap="md">
              <ProfessionButton
                profession={{
                  count: 0,
                  key: 'all',
                  translation: 'Alle eksperter',
                }}
              />
              {professions.map((profession) => (
                <ProfessionButton
                  key={profession.key}
                  profession={profession}
                />
              ))}
            </Flex>
          </Stack>
          <Stack gap="xl">
            <Title order={2}>
              <span style={{fontWeight: 500}}>Top Eksperter.</span>{' '}
              <span style={{color: '#666', fontWeight: 400}}>
                Adgang til de bedste eksperter har aldrig været nemmere.
              </span>
            </Title>

            <UserList
              initialData={users.results}
              initialCursor={users.nextCursor}
            />
          </Stack>
        </Stack>
      </Box>
    </>
  );
}

const fetchData = async (nextCursor?: string) => {
  const response = await getBookingShopifyApi().usersList({
    nextCursor,
    limit: LIMIT,
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

  return (
    <InfiniteScroll
      dataLength={data.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
    >
      <SimpleGrid spacing="lg" cols={{base: 2, sm: 3, md: 4, lg: 7}}>
        {data?.map((user) => (
          <ArtistCard artist={user} key={user.customerId} />
        ))}
      </SimpleGrid>
    </InfiniteScroll>
  );
};
