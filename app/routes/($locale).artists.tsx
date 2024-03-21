import {
  Avatar,
  Button,
  Card,
  Flex,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import {Link, useLoaderData} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {Wrapper} from '~/components/Wrapper';
import {VisualTeaser} from '~/components/metaobjects/VisualTeaser';
import {METAFIELD_QUERY} from '~/data/fragments';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import type {User} from '~/lib/api/model';

const LIMIT = '25';

export const loader = async ({request, context}: LoaderFunctionArgs) => {
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

  return json({users: payload, visualTeaser});
};

export default function Collections() {
  const {users, visualTeaser} = useLoaderData<typeof loader>();

  return (
    <>
      <VisualTeaser component={visualTeaser} />

      <Wrapper>
        <UserList
          initialData={users.results}
          initialCursor={users.nextCursor}
        />
      </Wrapper>
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
      <SimpleGrid cols={{base: 2, md: 4}}>
        {data?.map((user) => (
          <ArtistCard artist={user} key={user.customerId} />
        ))}
      </SimpleGrid>
    </InfiniteScroll>
  );
};

export const ArtistCard = ({artist}: {artist: User}) => (
  <Card
    radius="md"
    withBorder
    p="lg"
    bg="var(--mantine-color-body)"
    component={Link}
    to={`/artist/${artist.username}`}
  >
    <Stack gap="md" justify="center">
      <Flex justify="center">
        <Avatar
          src={artist.images?.profile?.url}
          radius="100%"
          w="220px"
          h="220px"
        />
      </Flex>
      <div>
        <Text ta="center" fz="lg" fw={500} c="black">
          {artist.fullname}
        </Text>
        <Text ta="center" c="dimmed" fz="sm">
          {artist.shortDescription}
        </Text>
      </div>

      <Flex justify="center">
        <Button variant="default" size="xs" radius="lg">
          Vis profile
        </Button>
      </Flex>
    </Stack>
  </Card>
);
