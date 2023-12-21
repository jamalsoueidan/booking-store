import {Box, Container, SimpleGrid} from '@mantine/core';
import {useLoaderData} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {ArtistCard} from '~/components/artists/ArtistCard';
import {IndexTitle} from '~/components/index/IndexTitle';
import {IndexTopBackground} from '~/components/index/IndexTopBackground';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type User} from '~/lib/api/model';

const LIMIT = '25';

export const loader = async ({request, context}: LoaderFunctionArgs) => {
  const {payload} = await getBookingShopifyApi().usersList({limit: LIMIT});
  return json(payload);
};

export default function Collections() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <IndexTopBackground bg="red.1" mb="70">
        <IndexTitle
          overtitle="Skønhedseksperter"
          subtitle="Booke tid hos en skønhedsekspert, der passer perfekt til dine behov."
        >
          Find den perfekte skønhedsekspert til dine behov!
        </IndexTitle>
      </IndexTopBackground>

      <Box my="xl">
        <Container size="lg">
          <UserList
            initialData={data.results}
            initialCursor={data.nextCursor}
          />
        </Container>
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
      <SimpleGrid cols={{base: 2, md: 4}}>
        {data?.map((user) => (
          <ArtistCard artist={user} key={user.customerId} />
        ))}
      </SimpleGrid>
    </InfiniteScroll>
  );
};
