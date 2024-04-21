import {Carousel} from '@mantine/carousel';
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
import {parseGid} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import Autoplay from 'embla-carousel-autoplay';
import {useRef} from 'react';
import type {
  PageComponentMetaobjectFragment,
  PageFragment,
  RecommendedTreatmentsQuery,
} from 'storefrontapi.generated';
import {TreatmentCard} from '~/components/treatment/TreatmentCard';

import {IconArrowRight, IconMoodWink, IconSearch} from '@tabler/icons-react';
import {Slider} from '~/components/Slider';
import {METAFIELD_QUERY, PRODUCT_ITEM_FRAGMENT} from '~/data/fragments';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import type {
  ProductsGetUsersImageResponse,
  UsersSearchResponse,
} from '~/lib/api/model';

import {useMediaQuery} from '@mantine/hooks';
import {ArtistCard} from '~/components/ArtistCard';
import {useField} from '~/components/blocks/utils';
import {ProfessionButton} from '~/components/ProfessionButton';
import {H1} from '~/components/titles/H1';
import {H2} from '~/components/titles/H2';
import {useComponents} from '~/lib/use-components';
import {
  loader as loaderProfessions,
  type Profession,
} from './api.users.professions';
import {COLLECTIONS_QUERY} from './categories';

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

  const {products: recommendedTreatments} = await storefront.query(
    RECOMMENDED_TREATMENT_QUERY,
  );

  const recommendedTreatmentsProductsUsers =
    await getBookingShopifyApi().productsGetUsersImage({
      productIds:
        recommendedTreatments?.nodes.map((p) => parseGid(p.id).id) || [],
    });

  const professions = await loaderProfessions(args).then((r) => r.json());

  const artists = await getBookingShopifyApi().usersSearch(
    {},
    {
      limit: '5',
      sortOrder: 'desc',
    },
  );

  const collections = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: {first: 10},
  });

  const components = await context.storefront.query(METAFIELD_QUERY, {
    variables: {
      handle: 'index',
      type: 'components',
    },
  });

  return json(
    {
      recommendedTreatmentsProductsUsers,
      recommendedTreatments,
      collections,
      artists,
      components,
      professions,
    },
    {
      headers: {
        'Oxygen-Cache-Control':
          'public, s-maxage=3600, stale-while-revalidate=3600',
        Vary: 'Accept-Encoding',
      },
    },
  );
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

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
                size="lg"
                radius="md"
                rightSection={<IconSearch />}
              >
                Find en skønhedsekspert
              </Button>

              <Button
                variant="outline"
                color="#8a60f6"
                component={Link}
                to="/pages/start-din-skoenhedskarriere"
                size="lg"
                radius="md"
                rightSection={<IconMoodWink />}
              >
                Start din skønhedskarriere
              </Button>
            </Flex>
          </Stack>
        </Container>
      </Box>

      <FeaturedArtists artists={data.artists} professions={data.professions} />
      <RecommendedTreatments
        products={data.recommendedTreatments}
        productsUsers={data.recommendedTreatmentsProductsUsers}
      />

      <DynamicComponents components={data.components.metaobject} />
    </>
  );
}

function DynamicComponents({
  components,
}: {
  components?: PageComponentMetaobjectFragment | null;
}) {
  const field = useField(components);
  const com = field.getField<PageFragment['components']>('components');
  const markup = useComponents(com);
  return <>{markup}</>;
}

function FeaturedArtists({
  artists,
  professions,
}: {
  artists: UsersSearchResponse;
  professions?: Array<Profession>;
}) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery('(max-width: 62em)');
  if (!artists) return null;

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

          <ScrollArea
            h="auto"
            w="100%"
            type={isMobile ? 'always' : 'never'}
            py={isMobile ? 'md' : undefined}
          >
            <Flex justify="center" gap={isMobile ? 'sm' : 'lg'}>
              {professions?.map((profession) => (
                <ProfessionButton
                  key={profession.translation}
                  profession={profession}
                />
              ))}
            </Flex>
          </ScrollArea>

          <SimpleGrid cols={{base: 2, sm: 3, md: 5}} spacing="xl">
            {artists.payload.results.map((artist) => (
              <ArtistCard key={artist.customerId} artist={artist} />
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
  productsUsers,
}: {
  products: RecommendedTreatmentsQuery['products'];
  productsUsers: ProductsGetUsersImageResponse;
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
            {products.nodes.map((product) => {
              const productUsers = productsUsers.payload.find(
                (p) => p.productId.toString() === parseGid(product.id).id,
              );

              return (
                <Carousel.Slide key={product.id}>
                  <TreatmentCard
                    product={product}
                    productUsers={productUsers}
                    loading="lazy"
                  />
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

const RECOMMENDED_TREATMENT_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query RecommendedTreatments ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 12, sortKey: RELEVANCE, reverse: true, query: "tag:treatments") {
      nodes {
        ...ProductItem
      }
    }
  }
` as const;
