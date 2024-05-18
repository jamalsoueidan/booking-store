import {
  Box,
  Button,
  Container,
  Flex,
  getGradient,
  Image,
  rem,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import {Link, useLoaderData} from '@remix-run/react';
import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@shopify/remix-oxygen';
import {IconArrowRight} from '@tabler/icons-react';
import {H2} from '~/components/titles/H2';
import {METAFIELD_QUERY} from '~/data/fragments';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import type {User, UserTop} from '~/lib/api/model';
import {modifyImageUrl} from '~/lib/image';
import {
  ProfessionSentenceTranslations,
  ProfessionTranslations,
} from './api.users.professions';

const LIMIT = '20';

export const meta: MetaFunction = () => {
  return [{title: `BySisters | Find Skønhedseksperter`}];
};

export const loader = async ({context}: LoaderFunctionArgs) => {
  const {payload: users} = await getBookingShopifyApi().usersTop(
    {
      limit: LIMIT,
      page: '1',
    },
    context,
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
              <UserCard user={user} key={user.customerId} />
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

export const UserCard = ({user}: {user: UserTop | User}) => {
  return (
    <UnstyledButton
      component={Link}
      to={`/artist/${user.username}`}
      style={{borderRadius: '5%', border: '1px solid #f4f4f4'}}
    >
      <Image
        sizes="(min-width: 45em) 50vw, 100vw"
        src={modifyImageUrl(user.images.profile?.url, '250x250')}
        style={{
          borderTopLeftRadius: '5%',
          borderTopRightRadius: '5%',
        }}
        fallbackSrc="https://placehold.co/400x600?text=Ekspert"
        loading="lazy"
      />
      <Box p="xs" pb="xs" pt="6px">
        <Text fz="lg" fw={500} c="black">
          {user.fullname}
        </Text>
        <Text fz="sm" c="#666">
          {user.shortDescription}
        </Text>
      </Box>
    </UnstyledButton>
  );
};
