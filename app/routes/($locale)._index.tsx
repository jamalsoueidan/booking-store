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
  Skeleton,
  Stack,
  Title,
  useMantineTheme,
} from '@mantine/core';
import {Await, Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import Autoplay from 'embla-carousel-autoplay';
import {Suspense, useRef} from 'react';
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

import {ArtistCard} from '~/components/ArtistCard';
import {useField} from '~/components/blocks/utils';
import {ProfessionButton} from '~/components/ProfessionButton';
import {H1} from '~/components/titles/H1';
import {H2} from '~/components/titles/H2';
import {useComponents} from '~/lib/use-components';
import {
  loader as loaderProfessions,
  type Profession,
} from './($locale).api.users.professions';
import {COLLECTIONS_QUERY} from './($locale).categories';

export function shouldRevalidate() {
  return false;
}

export const meta: MetaFunction = () => {
  return [{title: 'BySisters | Home'}];
};

export async function loader(args: LoaderFunctionArgs) {
  const {context} = args;
  const {storefront} = context;

  const recommendedTreatments = await storefront.query(
    RECOMMENDED_TREATMENT_QUERY,
  );

  const recommendedTreatmentsProductsUsers =
    getBookingShopifyApi().productsGetUsersImage({
      productIds:
        recommendedTreatments?.products.nodes.map((p) => parseGid(p.id).id) ||
        [],
    });

  const professions = loaderProfessions(args).then((r) => r.json());

  const artists = getBookingShopifyApi().usersSearch(
    {},
    {
      limit: '5',
      sortOrder: 'desc',
    },
  );

  const collections = context.storefront.query(COLLECTIONS_QUERY, {
    variables: {first: 10},
  });

  const components = context.storefront.query(METAFIELD_QUERY, {
    variables: {
      handle: 'index',
      type: 'components',
    },
  });

  return defer({
    recommendedTreatmentsProductsUsers,
    recommendedTreatments,
    collections,
    artists,
    components,
    professions,
  });
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <Box py={{base: rem(40), sm: rem(60)}}>
        <Container size="xl">
          <Stack gap="xl">
            <H1 gradients={{from: 'orange', to: 'orange.3'}}>
              Find professionelle [skønhedseksperter] og book deres
              [behandlinger] direkte på vores platform
            </H1>
            <Title order={2} c="dimmed" fw="normal" ta="center" lineClamp={2}>
              Vores platform forbinder dig med talentfulde eksperter inden for
              alle aspekter af skønhed.
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

      <Suspense fallback={<></>}>
        <Await resolve={data.components}>
          {(metaobject) => (
            <DynamicComponents components={metaobject.metaobject} />
          )}
        </Await>
      </Suspense>
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
  artists: Promise<UsersSearchResponse>;
  professions?: Promise<Array<Profession>>;
}) {
  const theme = useMantineTheme();
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

          <ScrollArea h="auto" w="100%" type="never">
            <Flex justify="center" gap="lg">
              <Suspense
                fallback={[...Array(5)].map((_, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Skeleton key={index} height={50} circle />
                ))}
              >
                <Await resolve={professions}>
                  {(profession) =>
                    profession?.map((profession) => (
                      <ProfessionButton
                        key={profession.translation}
                        profession={profession}
                      />
                    ))
                  }
                </Await>
              </Suspense>
            </Flex>
          </ScrollArea>

          <SimpleGrid cols={{base: 2, sm: 3, md: 5}} spacing="xl">
            <Suspense
              fallback={[...Array(5)].map((_, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Skeleton key={index} height={250} />
              ))}
            >
              <Await resolve={artists}>
                {({payload}) =>
                  payload.results.map((artist) => (
                    <ArtistCard key={artist.customerId} artist={artist} />
                  ))
                }
              </Await>
            </Suspense>
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
  products: RecommendedTreatmentsQuery;
  productsUsers: Promise<ProductsGetUsersImageResponse>;
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
          <Suspense
            fallback={
              <Flex gap="lg">
                {[...Array(6)].map((_, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Skeleton key={index} height={300} />
                ))}
              </Flex>
            }
          >
            <Await resolve={productsUsers}>
              {({payload: productsUsers}) => (
                <Suspense
                  fallback={
                    <Slider
                      plugins={[AUTOPLAY_DELAY.current]}
                      slideSize={{base: '100%', md: '20%'}}
                    >
                      {[...Array(4)].map((_, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <Carousel.Slide key={index}>
                          <Skeleton height={50} />
                        </Carousel.Slide>
                      ))}
                    </Slider>
                  }
                >
                  <Await resolve={products}>
                    {({products}) => (
                      <Slider
                        plugins={[AUTOPLAY_DELAY.current]}
                        slideSize={{base: '100%', md: '20%'}}
                      >
                        {products.nodes.map((product) => {
                          const productUsers = productsUsers.find(
                            (p) =>
                              p.productId.toString() ===
                              parseGid(product.id).id,
                          );

                          return (
                            <Carousel.Slide key={product.id}>
                              <TreatmentCard
                                product={product}
                                productUsers={productUsers}
                                loading={'eager'}
                              />
                            </Carousel.Slide>
                          );
                        })}
                      </Slider>
                    )}
                  </Await>
                </Suspense>
              )}
            </Await>
          </Suspense>
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
