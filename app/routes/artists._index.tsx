import {
  Box,
  Button,
  Container,
  Flex,
  getGradient,
  rem,
  SimpleGrid,
  Stack,
  useMantineTheme,
} from '@mantine/core';
import {Link, useLoaderData} from '@remix-run/react';
import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@shopify/remix-oxygen';
import {IconArrowRight} from '@tabler/icons-react';
import {ArtistCard} from '~/components/ArtistCard';
import {H2} from '~/components/titles/H2';
import {METAFIELD_QUERY} from '~/data/fragments';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {
  ProfessionSentenceTranslations,
  ProfessionTranslations,
} from './api.users.professions';

const LIMIT = '20';

export const meta: MetaFunction = () => {
  return [{title: `BySisters | Find Skønhedseksperter`}];
};

export const loader = async (args: LoaderFunctionArgs) => {
  const {context} = args;

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
  const theme = useMantineTheme();
  const {users} = useLoaderData<typeof loader>();

  const professions = users.map((user) => (
    <Box
      key={user.profession}
      bg={getGradient({deg: 180, from: 'white', to: 'white'}, theme)}
      py={{base: rem(40), sm: rem(60)}}
    >
      <Container size="xl">
        <Stack gap="xl">
          <H2
            gradients={{from: '#9030ed', to: '#e71b7c'}}
            fz={{base: rem(30), sm: rem(40)}}
            lh={{base: rem(40), sm: rem(50)}}
          >
            {ProfessionSentenceTranslations[user.profession || '']}
          </H2>
          <SimpleGrid spacing="lg" cols={{base: 2, sm: 3, md: 4, lg: 5}}>
            {user.users?.map((user) => (
              <ArtistCard artist={user} key={user.customerId} />
            ))}
          </SimpleGrid>
          <Flex justify="center">
            <Button
              variant="outline"
              color="black"
              size="lg"
              aria-label="Settings"
              component={Link}
              to={`/artists/search?profession=${user.profession}`}
              radius="lg"
              rightSection={
                <IconArrowRight
                  style={{width: '70%', height: '70%'}}
                  stroke={1.5}
                />
              }
            >
              Vis alle{' '}
              {ProfessionTranslations[
                user.profession || ''
              ].toLocaleLowerCase()}{' '}
              artister
            </Button>
          </Flex>
        </Stack>
      </Container>
    </Box>
  ));

  return <>{professions}</>;
}
