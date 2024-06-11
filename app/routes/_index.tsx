import {
  Box,
  Button,
  Container,
  Flex,
  getGradient,
  rem,
  ScrollArea,
  SimpleGrid,
  Stack,
  Title,
  useMantineTheme,
} from '@mantine/core';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import Autoplay from 'embla-carousel-autoplay';

import {IconArrowRight, IconMoodWink, IconSearch} from '@tabler/icons-react';

import {Carousel} from '@mantine/carousel';
import {useMediaQuery} from '@mantine/hooks';
import {useRef} from 'react';
import type {
  ArticleUserFragment,
  CategoriesCollectionFragment,
} from 'storefrontapi.generated';
import {Slider} from '~/components/Slider';
import {H1} from '~/components/titles/H1';
import {H2} from '~/components/titles/H2';

import {ProfessionButton} from '~/components/ProfessionButton';
import {ARTICLE_USER_FRAGMENT} from '~/graphql/fragments/ArticleUser';
import {METAFIELD_QUERY} from '~/graphql/queries/Metafield';

import {Headless} from '~/components/blocks/Headless';
import {getTags} from '~/lib/tags';
import {UserCard} from './artists._index';
import {
  CATEGORIES_COLLECTION_FRAGMENT,
  TreatmentCard,
} from './categories.($handle)._index';

export function shouldRevalidate() {
  return false;
}

export const meta: MetaFunction = () => {
  return [
    {
      title:
        'BySisters | Find skønhedseksperter og book deres [behandlinger] direkte på vores platform. Vores platform forbinder dig med talentfulde skønhedseksperter inden for alle aspekter af skønhed.',
    },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  const {context} = args;
  const {storefront} = context;

  const tags = await getTags(
    context.env.PUBLIC_STORE_DOMAIN,
    context.env.PRIVATE_API_ACCESS_TOKEN,
  );

  const {products: recommendedTreatments} = await storefront.query(
    RECOMMENDED_TREATMENTS_QUERY,
    {
      variables: {
        query: 'tag:treatments AND tag:system',
      },
      cache: context.storefront.CacheShort(),
    },
  );

  const {data} = await storefront.query(USERS_QUERY, {
    cache: context.storefront.CacheShort(),
  });

  const {metaobject: components} = await context.storefront.query(
    METAFIELD_QUERY,
    {
      variables: {
        handle: 'index',
        type: 'components',
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
      cache: context.storefront.CacheShort(),
    },
  );

  return json({
    recommendedTreatments,
    users: data?.users.nodes || [],
    components,
    tags,
  });
}

export default function Homepage() {
  const {users, recommendedTreatments, components, tags} =
    useLoaderData<typeof loader>();

  return (
    <>
      <Box pt={rem(100)} pb={rem(50)}>
        <Container size="xl">
          <Stack gap="xl">
            <H1 gradients={{from: 'orange', to: 'orange.3'}}>
              Find [skønhedseksperter] og book deres [behandlinger] direkte på
              vores platform
            </H1>
            <Title order={2} c="dimmed" fw="normal" ta="center">
              Vores platform forbinder dig med talentfulde skønhedseksperter
              inden for alle aspekter af skønhed.
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
                to="/artists"
                size="xl"
                radius="md"
                fw="bold"
                rightSection={<IconSearch />}
              >
                Find en skønhedsekspert
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
                Vis behandlinger
              </Button>
            </Flex>
          </Stack>
        </Container>
      </Box>

      <FeaturedArtists users={users as any} tags={tags} />
      <RecommendedTreatments products={recommendedTreatments.nodes} />
      <Headless components={components?.components} />
    </>
  );
}

function FeaturedArtists({
  users,
  tags,
}: {
  users: ArticleUserFragment[];
  tags?: Record<string, string[]>;
}) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery('(max-width: 62em)');
  if (!users) return null;

  return (
    <Box
      bg={getGradient({deg: 180, from: 'white', to: 'yellow.1'}, theme)}
      py={{base: rem(40), sm: rem(60)}}
    >
      <Container size="xl">
        <Stack gap="xl">
          <H2 gradients={{from: '#9030ed', to: '#e71b7c'}}>
            Mød vores [talentfulde eksperter]
          </H2>

          {tags && tags['profession'] ? (
            <ScrollArea
              h="auto"
              w="100%"
              type={isMobile ? 'always' : 'never'}
              py={isMobile ? 'md' : undefined}
            >
              <Flex justify="center" gap={isMobile ? 'sm' : 'lg'}>
                {tags['profession']?.map((profession) => (
                  <ProfessionButton key={profession} profession={profession} />
                ))}
              </Flex>
            </ScrollArea>
          ) : null}

          <SimpleGrid cols={{base: 1, sm: 3}} spacing="xl">
            {users.map((user) => (
              <UserCard key={user.id} article={user} />
            ))}
          </SimpleGrid>
          <Flex justify="center">
            <Button
              variant="outline"
              color="black"
              size="lg"
              aria-label="Settings"
              component={Link}
              to="/artists"
              radius="lg"
              rightSection={
                <IconArrowRight
                  style={{width: '70%', height: '70%'}}
                  stroke={1.5}
                />
              }
            >
              Vis skønhedseksperter
            </Button>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
}

function RecommendedTreatments({
  products,
}: {
  products: CategoriesCollectionFragment[];
}) {
  const theme = useMantineTheme();
  const AUTOPLAY_DELAY = useRef(Autoplay({delay: 2000}));

  return (
    <Box
      bg={getGradient({deg: 180, from: 'yellow.1', to: 'pink.1'}, theme)}
      py={{base: rem(40), sm: rem(60)}}
    >
      <Stack gap="xl">
        <Container size="xl">
          <H2 gradients={{from: '#9030ed', to: '#e71b7c'}}>
            Book unikke [oplevelser og skønhedsoplevelse]
          </H2>
        </Container>
        <Box px="xl" style={{overflow: 'hidden'}}>
          <Slider
            plugins={[AUTOPLAY_DELAY.current]}
            slideSize={{base: '100%', md: '20%'}}
          >
            {products.map((product) => {
              return (
                <Carousel.Slide key={product.id}>
                  <TreatmentCard product={product} />
                </Carousel.Slide>
              );
            })}
          </Slider>
        </Box>
        <Container size="xl">
          <Flex justify="center">
            <Button
              variant="outline"
              color="black"
              size="lg"
              aria-label="Settings"
              component={Link}
              to="/categories"
              radius="lg"
              rightSection={
                <IconArrowRight
                  style={{width: '70%', height: '70%'}}
                  stroke={1.5}
                />
              }
            >
              Vis Kategorier
            </Button>
          </Flex>
        </Container>
      </Stack>
    </Box>
  );
}

export const RECOMMENDED_TREATMENTS_QUERY = `#graphql
  ${CATEGORIES_COLLECTION_FRAGMENT}
  query RecommendedTreatments(
    $query: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: 10, sortKey: RELEVANCE, query: $query) {
      nodes {
        ...CategoriesCollection
      }
    }
  }
` as const;

export const USERS_QUERY = `#graphql
  ${ARTICLE_USER_FRAGMENT}
  query FrontUsers(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    data: blog(id: "gid://shopify/Blog/105364226375") {
      users: articles(first: 3, sortKey: PUBLISHED_AT, reverse: true, query: "tag:parentid") {
        nodes {
          ...ArticleUser
        }
      }
    }
  }
` as const;
