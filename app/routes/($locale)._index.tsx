import {Carousel} from '@mantine/carousel';
import {
  Box,
  Button,
  Container,
  Flex,
  getGradient,
  rem,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
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
  UsersListResponse,
} from '~/lib/api/model';

import {ArtistCard} from '~/components/ArtistCard';
import {useField} from '~/components/blocks/utils';
import {ProfessionButton} from '~/components/ProfessionButton';
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

  const artists = getBookingShopifyApi().usersList({
    limit: '8',
    sortOrder: 'desc',
  });

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
            <Title
              order={1}
              ta="center"
              lts="1px"
              fw="bold"
              fz={{base: rem(40), sm: rem(65)}}
              lh={{base: rem(45), sm: rem(70)}}
            >
              Find professionelle{' '}
              <Text
                span
                inherit
                variant="gradient"
                gradient={{from: 'orange', to: 'orange.3', deg: 180}}
              >
                skønhedseksperter
              </Text>{' '}
              og book deres{' '}
              <Text
                span
                inherit
                variant="gradient"
                gradient={{from: 'orange', to: 'orange.3', deg: 180}}
              >
                behandlinger
              </Text>{' '}
              direkte på vores platform
            </Title>
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
  artists: Promise<UsersListResponse>;
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
          <Title
            order={2}
            ta="center"
            lts="1px"
            fw="bold"
            fz={{base: rem(35), sm: rem(45)}}
            lh={{base: rem(45), sm: rem(55)}}
          >
            Mød vores{' '}
            <Text
              span
              inherit
              variant="gradient"
              gradient={{from: '#9030ed', to: '#e71b7c', deg: 90}}
            >
              talentfulde eksperter
            </Text>
          </Title>

          <Flex gap="lg" justify="center">
            <Suspense
              fallback={
                <>
                  <Skeleton height={10} radius="lg" />
                  <Skeleton height={10} radius="lg" />
                  <Skeleton height={10} radius="lg" />
                  <Skeleton height={10} radius="lg" />
                  <Skeleton height={10} radius="lg" />
                </>
              }
            >
              <Await resolve={professions}>
                {(profession) =>
                  profession?.map((profession) => (
                    <ProfessionButton
                      key={profession.key}
                      profession={profession}
                    />
                  ))
                }
              </Await>
            </Suspense>
          </Flex>

          <SimpleGrid cols={{base: 2, sm: 3, md: 5}} spacing="xl">
            <Suspense
              fallback={[...Array(5)].map((_, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Skeleton key={index} height={50} />
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
      px="xl"
      style={{overflow: 'hidden'}}
    >
      <Stack gap="xl">
        <Container size="xl">
          <Title
            order={2}
            ta="center"
            lts="1px"
            fw="bold"
            fz={{base: rem(35), sm: rem(45)}}
            lh={{base: rem(45), sm: rem(55)}}
          >
            Book unikke{' '}
            <Text
              span
              inherit
              variant="gradient"
              gradient={{from: 'orange', to: 'yellow', deg: 90}}
            >
              oplevelser og skønhedsoplevelse
            </Text>
          </Title>
        </Container>
        <Suspense
          fallback={
            <Flex gap="lg">
              {[...Array(4)].map((_, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Skeleton key={index} height={50} />
              ))}
            </Flex>
          }
        >
          <Await resolve={productsUsers}>
            {({payload: productsUsers}) => (
              <Suspense
                fallback={
                  <Flex gap="lg">
                    {[...Array(4)].map((_, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <Skeleton key={index} height={50} />
                    ))}
                  </Flex>
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
                            p.productId.toString() === parseGid(product.id).id,
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
