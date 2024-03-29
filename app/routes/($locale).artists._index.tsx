import {Anchor, Flex, rem, SimpleGrid, Stack, Title} from '@mantine/core';
import {useLoaderData} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconArrowRightBar} from '@tabler/icons-react';
import {ArtistCard} from '~/components/ArtistCard';
import {METAFIELD_QUERY} from '~/data/fragments';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {
  ProfessionSentenceTranslations,
  ProfessionTranslations,
} from './($locale).api.users.professions';

const LIMIT = '20';

export const loader = async (args: LoaderFunctionArgs) => {
  const {context, request} = args;

  const {payload: users} = await getBookingShopifyApi().usersTop({
    limit: LIMIT,
    page: '1',
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

  const professions = users.map((user) => (
    <Stack key={user.profession} gap="lg">
      <Stack gap="4">
        <Title order={2}>
          <span style={{fontWeight: 500}}>
            {ProfessionTranslations[user.profession]}.
          </span>{' '}
          <span style={{color: '#666', fontWeight: 400}}>
            {ProfessionSentenceTranslations[user.profession]}
          </span>
        </Title>
        <Anchor
          variant="text"
          c="black"
          fw={500}
          fz="md"
          href={`/artists/list?profession=${user.profession}`}
        >
          <Flex gap="xs">
            Vis alle
            <IconArrowRightBar />
          </Flex>
        </Anchor>
      </Stack>
      <SimpleGrid spacing="lg" cols={{base: 2, sm: 3, md: 4, lg: 7}}>
        {user.users?.map((user) => (
          <ArtistCard artist={user} key={user.customerId} />
        ))}
      </SimpleGrid>
    </Stack>
  ));

  return <Stack gap={rem(64)}>{professions}</Stack>;
}
