import {Carousel} from '@mantine/carousel';
import {
  Box,
  Button,
  Container,
  Flex,
  rem,
  SimpleGrid,
  Skeleton,
  Stack,
  Title,
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
import {Hero} from '~/components/Hero';
import {TreatmentCard} from '~/components/treatment/TreatmentCard';

import {IconArrowRight} from '@tabler/icons-react';
import {Slider} from '~/components/Slider';
import {METAFIELD_QUERY, PRODUCT_ITEM_FRAGMENT} from '~/data/fragments';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import type {
  ProductsGetUsersImageResponse,
  UsersListResponse,
} from '~/lib/api/model';

import {ArtistCard} from '~/components/ArtistCard';
import {useField} from '~/components/metaobjects/utils';
import {ProfessionButton} from '~/components/ProfessionButton';
import {useComponents} from '~/lib/use-components';
import {
  loader as loaderProfessions,
  type Profession,
} from './($locale).api.users.professions';
import {COLLECTIONS_QUERY} from './($locale).categories._index';

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

  const response = await loaderProfessions(args);

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
    professions: response.json(),
  });
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <Box bg="blue.1" mt="-70px" pt="70" pb={{base: 'md', sm: '42'}}>
        <Hero />
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
  if (!artists) return null;

  return (
    <Box bg="yellow.1" p={{base: 'md', sm: '42'}}>
      <Container size="xl">
        <Stack gap="xl">
          <Title
            order={2}
            ta="center"
            lts="1px"
            fw={500}
            size={rem(48)}
            c="pink"
          >
            Mød vores talentfulde eksperter
          </Title>

          <Flex gap="lg" justify="center">
            <Suspense
              fallback={
                <>
                  <Skeleton height={10} radius="lg" />
                  <Skeleton height={20} />
                  <Skeleton height={10} />
                  <Skeleton height={10} />
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
              fallback={
                <>
                  <Skeleton height={50} />
                  <Skeleton height={50} />
                  <Skeleton height={50} />
                  <Skeleton height={50} />
                </>
              }
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
  const AUTOPLAY_DELAY = useRef(Autoplay({delay: 2000}));

  return (
    <Box bg="pink.1" py="60" px="xl">
      <Stack gap="xl">
        <Container size="xl">
          <Title
            order={2}
            ta="center"
            lts="1px"
            fw={500}
            size={rem(48)}
            c="black"
          >
            Book unikke oplevelser og skønhedsoplevelse
          </Title>
        </Container>
        <Suspense
          fallback={
            <Flex gap="lg">
              <Skeleton height={50} />
              <Skeleton height={50} />
              <Skeleton height={50} />
              <Skeleton height={50} />
            </Flex>
          }
        >
          <Await resolve={productsUsers}>
            {({payload: productsUsers}) => (
              <Suspense
                fallback={
                  <Flex gap="lg">
                    <Skeleton height={50} />
                    <Skeleton height={50} />
                    <Skeleton height={50} />
                    <Skeleton height={50} />
                  </Flex>
                }
              >
                <Await resolve={products}>
                  {({products}) => (
                    <Slider
                      plugins={[AUTOPLAY_DELAY.current]}
                      slideSize={{base: '50%', md: '20%'}}
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
          <Flex justify="space-between">
            <Button
              variant="filled"
              color="black"
              size="xl"
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
