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

import {IconArrowRight, IconMoodWink, IconSearch} from '@tabler/icons-react';

import {Slice, Slider} from '~/components/Slider';
import {H1} from '~/components/titles/H1';
import {H2} from '~/components/titles/H2';

import {ProfessionButton} from '~/components/ProfessionButton';

import {getPaginationVariables} from '@shopify/hydrogen';
import {Headless} from '~/components/blocks/Headless';
import {getTags} from '~/lib/tags';
import {TranslationProvider, useTranslations} from '~/providers/Translation';
import {UserCard, USERS_QUERY} from './artists._index';
import {
  CATEGORIES_COLLECTION_FRAGMENT,
  TreatmentCard,
} from './categories.($handle)._index';
import {PAGE_QUERY} from './pages.$handle';

export function shouldRevalidate() {
  return false;
}

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

  const {products: recommendedTreatments} = await storefront.query(
    RECOMMENDED_TREATMENTS_QUERY,
    {
      variables: {
        query: 'tag:treatments AND tag:system',
      },
      cache: context.storefront.CacheShort(),
    },
  );

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 5,
  });

  const {data} = await storefront.query(USERS_QUERY, {
    variables: {
      sortKey: 'PUBLISHED_AT',
      reverse: true,
      query: 'tag:parentid',
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
    recommendedTreatments,
    users: data,
    page,
    tags,
    language: context.storefront.i18n.language,
  });
}

export default function Homepage() {
  const {page} = useLoaderData<typeof loader>();

  return (
    <TranslationProvider data={page?.translations}>
      <Header />
      <FeaturedArtists />
      <RecommendedTreatments />
      <Headless components={page?.components} />
    </TranslationProvider>
  );
}

function Header() {
  const {t} = useTranslations();

  return (
    <Box pt={rem(100)} pb={rem(50)}>
      <Container size="xl">
        <Stack gap="xl">
          <H1 gradients={{from: 'orange', to: 'orange.3'}}>
            {t('index_title') as string}
          </H1>
          <Title order={2} c="dimmed" fw="normal" ta="center">
            {t('index_subtitle')}
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
              {t('index_left_button')}
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
              {t('index_right_button')}
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
  const {t} = useTranslations();

  return (
    <Box
      bg={getGradient({deg: 180, from: 'white', to: 'yellow.1'}, theme)}
      py={{base: rem(40), sm: rem(60)}}
    >
      <Container size="xl">
        <Stack gap="xl">
          <H2 gradients={{from: '#9030ed', to: '#e71b7c'}}>
            {t('index_artists_title')}
          </H2>

          {tags && tags['profession'] ? (
            <ScrollArea type="auto" offsetScrollbars="x">
              <Flex justify="center" gap={{base: 'sm', sm: 'lg'}}>
                {tags['profession']
                  ?.sort((a, b) => {
                    const translatedA = t(`profession_${a}`) || a;
                    const translatedB = t(`profession_${b}`) || b;
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
              to="/artists"
              radius="lg"
              rightSection={
                <IconArrowRight
                  style={{width: '70%', height: '70%'}}
                  stroke={1.5}
                />
              }
            >
              {t('index_artists_button')}
            </Button>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
}

function RecommendedTreatments() {
  const {recommendedTreatments, language} = useLoaderData<typeof loader>();
  const theme = useMantineTheme();
  const {t} = useTranslations();

  return (
    <Box
      bg={getGradient({deg: 180, from: 'yellow.1', to: 'pink.1'}, theme)}
      py={{base: rem(40), sm: rem(60)}}
    >
      <Stack gap="xl">
        <Container size="xl">
          <H2 gradients={{from: '#9030ed', to: '#e71b7c'}}>
            {t('index_treatments_title')}
          </H2>
        </Container>
        <Box px="xl" style={{overflow: 'hidden'}}>
          <Slider language={language}>
            {recommendedTreatments.nodes.map((product) => {
              return (
                <Slice key={product.id}>
                  <TreatmentCard product={product} />
                </Slice>
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
              {t('index_treatments_button')}
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
