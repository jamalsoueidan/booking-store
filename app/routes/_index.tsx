import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  getGradient,
  rem,
  ScrollArea,
  SimpleGrid,
  Stack,
  Title,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {IconArrowRight, IconMoodWink, IconSearch} from '@tabler/icons-react';

import {H1} from '~/components/titles/H1';
import {H2} from '~/components/titles/H2';

import {ProfessionButton} from '~/components/ProfessionButton';

import {getPaginationVariables} from '@shopify/hydrogen';
import {useTranslation} from 'react-i18next';
import {Headless} from '~/components/blocks/Headless';
import {getTags} from '~/lib/tags';
import {GET_CATEGORY_QUERY} from './categories_.$handle';
import {PAGE_QUERY} from './pages.$handle';
import {UserCard, USERS_QUERY} from './users._index';

export function shouldRevalidate() {
  return false;
}

export const handle: Handle = {
  i18n: ['index', 'categories'],
};

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {
      title: `BySisters: ${data?.page?.seo?.title}`,
    },
  ];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  const {storefront} = context;

  const tags = await getTags(
    context.env.PUBLIC_STORE_DOMAIN,
    context.env.PRIVATE_API_ACCESS_TOKEN,
  );

  const {collection: rootCollection} = await storefront.query(
    GET_CATEGORY_QUERY,
    {
      variables: {
        handle: 'alle-behandlinger',
      },
      cache: context.storefront.CacheShort(),
    },
  );

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  const {data} = await storefront.query(USERS_QUERY, {
    variables: {
      sortKey: 'PUBLISHED_AT',
      reverse: true,
      query: 'tag:"collectionid*"',
      ...paginationVariables,
    },
    cache: context.storefront.CacheShort(),
  });

  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: 'index',
    },
    cache: context.storefront.CacheLong(),
  });

  return json({
    users: data,
    page,
    tags,
    rootCollection,
  });
}

export default function Homepage() {
  const {page} = useLoaderData<typeof loader>();

  return (
    <>
      <Header />
      <Headless components={page?.options} />
      <FeaturedCollections />
      <FeaturedArtists />
      <Headless components={page?.components} />
    </>
  );
}

function Header() {
  const {t} = useTranslation(['index']);

  return (
    <Box pt={rem(100)} pb={rem(50)}>
      <Container size="xl">
        <Stack gap="xl">
          <H1 gradients={{from: 'orange', to: 'orange.3'}}>
            {t('index:title')}
          </H1>
          <Title order={2} c="dimmed" fw="normal" ta="center">
            {t('index:subtitle')}
          </Title>

          <Flex
            direction={{base: 'column', sm: 'row'}}
            justify="center"
            gap={{base: 'sm', sm: 'xl'}}
          >
            <Button
              variant="outline"
              color="orange"
              component={Link}
              to="/users"
              size="xl"
              radius="md"
              fw="bold"
              rightSection={<IconSearch />}
            >
              {t('index:left_button')}
            </Button>

            <Button
              variant="outline"
              color="pink"
              component={Link}
              to="/categories"
              size="xl"
              fw="bold"
              radius="md"
              rightSection={<IconMoodWink />}
            >
              {t('index:right_button')}
            </Button>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
}

function FeaturedCollections() {
  const theme = useMantineTheme();
  const {t} = useTranslation(['index']);
  const {rootCollection} = useLoaderData<typeof loader>();

  return (
    <Box
      bg={getGradient({deg: 180, from: 'white', to: 'pink.1'}, theme)}
      py={{base: rem(40), sm: rem(60)}}
    >
      <Container size="xl">
        <Stack gap="xl">
          <H2 gradients={{from: '#9030ed', to: '#e71b7c'}}>
            {t('collection_title')}
          </H2>

          <SimpleGrid cols={{base: 1, sm: 2, md: 4}} spacing="xl">
            {rootCollection?.children?.references?.nodes
              .slice(0, 4)
              .map((col) => (
                <Card key={col.id} radius="sm">
                  <UnstyledButton
                    component={Link}
                    to={`/categories/${col.handle}`}
                  >
                    <Flex justify="space-between">
                      <Title order={2} size="lg">
                        {col.title}
                      </Title>
                      <IconArrowRight />
                    </Flex>
                  </UnstyledButton>
                  <Card.Section>
                    <Divider my="sm" />
                  </Card.Section>
                  <Stack gap="xs">
                    {col.children?.references?.nodes.map((nesCol) => (
                      <UnstyledButton
                        key={nesCol.id}
                        component={Link}
                        to={`/categories/${nesCol.handle}`}
                      >
                        <Title order={2} size="lg">
                          {nesCol.title}
                        </Title>
                      </UnstyledButton>
                    ))}
                  </Stack>
                </Card>
              ))}
          </SimpleGrid>

          <Flex justify="center">
            <Button
              variant="outline"
              color="black"
              size="lg"
              aria-label="Settings"
              component={Link}
              to="/users"
              radius="lg"
              rightSection={
                <IconArrowRight
                  style={{width: '70%', height: '70%'}}
                  stroke={1.5}
                />
              }
            >
              {t('index:collection_button')}
            </Button>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
}

function FeaturedArtists() {
  const {users, tags} = useLoaderData<typeof loader>();
  const theme = useMantineTheme();
  const {t} = useTranslation(['index', 'professions']);

  return (
    <Box
      bg={getGradient({deg: 180, from: 'pink.1', to: 'yellow.1'}, theme)}
      py={{base: rem(40), sm: rem(60)}}
    >
      <Container size="xl">
        <Stack gap="xl">
          <H2 gradients={{from: '#9030ed', to: '#e71b7c'}}>
            {t('index:artists_title')}
          </H2>

          {tags && tags['profession'] ? (
            <ScrollArea type="auto" offsetScrollbars="x">
              <Flex justify="center" gap={{base: 'sm', sm: 'lg'}}>
                {tags['profession']
                  ?.sort((a, b) => {
                    const translatedA = t(`professions:${a}` as any) || a;
                    const translatedB = t(`professions:${b}` as any) || b;
                    return translatedA.localeCompare(translatedB);
                  })
                  .map((profession) => (
                    <ProfessionButton
                      key={profession}
                      profession={profession}
                    />
                  ))}
              </Flex>
            </ScrollArea>
          ) : null}

          <SimpleGrid cols={{base: 1, sm: 2, md: 3}} spacing="xl">
            {users?.users?.nodes.map((user) => (
              <UserCard key={user.id} article={user as any} />
            ))}
          </SimpleGrid>

          <Flex justify="center">
            <Button
              variant="outline"
              color="black"
              size="lg"
              aria-label="Settings"
              component={Link}
              to="/users"
              radius="lg"
              rightSection={
                <IconArrowRight
                  style={{width: '70%', height: '70%'}}
                  stroke={1.5}
                />
              }
            >
              {t('index:artists_button')}
            </Button>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
}
