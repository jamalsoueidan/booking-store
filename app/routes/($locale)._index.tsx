import {Carousel, type Embla} from '@mantine/carousel';
import {
  ActionIcon,
  Box,
  Button,
  Container,
  Flex,
  Group,
  rem,
  Skeleton,
  Stack,
  Title,
} from '@mantine/core';
import {Await, Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Suspense, useCallback, useState} from 'react';
import type {
  PageComponentMetaobjectFragment,
  PageFragment,
  RecommendedProductsQuery,
  RecommendedTreatmentsQuery,
} from 'storefrontapi.generated';
import {Hero} from '~/components/Hero';
import {ProductCard} from '~/components/ProductCard';
import {TreatmentCard} from '~/components/treatment/TreatmentCard';

import {IconArrowLeft, IconArrowRight} from '@tabler/icons-react';
import HeroCategories from '~/components/HeroCategories';
import {Slider} from '~/components/Slider';
import {Wrapper} from '~/components/Wrapper';
import {METAFIELD_QUERY, PRODUCT_ITEM_FRAGMENT} from '~/data/fragments';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import type {ProductsGetUsersImage, UsersListResponse} from '~/lib/api/model';

import {ArtistCard} from '~/components/ArtistCard';
import {useField} from '~/components/metaobjects/utils';
import {useComponents} from '~/lib/use-components';
import {COLLECTIONS_QUERY} from './($locale).categories._index';

export function shouldRevalidate() {
  return false;
}

export const meta: MetaFunction = () => {
  return [{title: 'BySisters | Home'}];
};

export async function loader({context}: LoaderFunctionArgs) {
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
  });
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <div
        style={{
          backgroundColor: '#ebedff',
          marginTop: '-70px',
          paddingTop: '70px',
          borderBottomRightRadius: '40% 15%',
          borderBottomLeftRadius: '40% 15%',
        }}
      >
        <Container size="lg" py={0} h="100%">
          <Hero />
        </Container>
      </div>

      <Suspense fallback={<div>Henter kategorier</div>}>
        <Await resolve={data.collections}>
          {({collections}) => (
            <Container size="lg" style={{marginTop: '-75px'}}>
              <HeroCategories collections={collections.nodes} />
            </Container>
          )}
        </Await>
      </Suspense>

      <Box>
        <FeaturedArtists artists={data.artists} />
        <Suspense fallback={<div>Henter behandlinger</div>}>
          <Await resolve={data.recommendedTreatmentsProductsUsers}>
            {({payload}) => (
              <RecommendedTreatments
                products={data.recommendedTreatments}
                productsUsers={payload}
              />
            )}
          </Await>
        </Suspense>

        <Suspense fallback={<div>Henter dynamisk komponenter</div>}>
          <Await resolve={data.components}>
            {(metaobject) => (
              <DynamicComponents components={metaobject.metaobject} />
            )}
          </Await>
        </Suspense>
      </Box>
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

function FeaturedArtists({artists}: {artists: Promise<UsersListResponse>}) {
  const [embla, setEmbla] = useState<Embla | null>(null);

  const scrollPrev = useCallback(() => {
    if (embla) embla.scrollPrev();
  }, [embla]);

  const scrollNext = useCallback(() => {
    if (embla) embla.scrollNext();
  }, [embla]);

  if (!artists) return null;

  return (
    <div
      style={{
        overflow: 'hidden',
      }}
    >
      <Wrapper>
        <Stack gap="lg">
          <Group justify="space-between">
            <Button
              variant="transparent"
              color="pink"
              size="compact-xl"
              aria-label="Settings"
              component={Link}
              to="/artists"
              p={0}
              rightSection={<IconArrowRight stroke={1.5} />}
            >
              Skønhedseksperter
            </Button>

            <Group>
              <ActionIcon
                variant="filled"
                color="pink"
                radius={'lg'}
                size={'lg'}
                aria-label="Tilbage"
                onClick={scrollPrev}
              >
                <IconArrowLeft stroke={1.5} />
              </ActionIcon>
              <ActionIcon
                variant="filled"
                color="pink"
                radius={'lg'}
                size={'lg'}
                aria-label="Right"
                onClick={scrollNext}
              >
                <IconArrowRight stroke={1.5} />
              </ActionIcon>
            </Group>
          </Group>
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
            <Await resolve={artists}>
              {({payload}) => (
                <Slider getEmblaApi={setEmbla}>
                  {payload.results.map((artist) => (
                    <Carousel.Slide key={artist.customerId}>
                      <ArtistCard artist={artist} />
                    </Carousel.Slide>
                  ))}
                </Slider>
              )}
            </Await>
          </Suspense>
        </Stack>
      </Wrapper>
    </div>
  );
}

function RecommendedTreatments({
  products,
  productsUsers,
}: {
  products: RecommendedTreatmentsQuery;
  productsUsers: ProductsGetUsersImage[];
}) {
  const [embla, setEmbla] = useState<Embla | null>(null);

  const scrollPrev = useCallback(() => {
    if (embla) embla.scrollPrev();
  }, [embla]);

  const scrollNext = useCallback(() => {
    if (embla) embla.scrollNext();
  }, [embla]);

  return (
    <div
      style={{
        overflow: 'hidden',
      }}
    >
      <Wrapper bg="pink.1">
        <Stack gap="xl">
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
                <Slider getEmblaApi={setEmbla}>
                  {products.nodes.map((product) => {
                    const productUsers = productsUsers.find(
                      (p) => p.productId.toString() === parseGid(product.id).id,
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
          <Flex justify="space-between">
            <Button
              variant="filled"
              color="black"
              size="md"
              aria-label="Settings"
              component={Link}
              to="/categories"
              rightSection={
                <IconArrowRight
                  style={{width: '70%', height: '70%'}}
                  stroke={1.5}
                />
              }
            >
              Vis Kategorier
            </Button>
            <Group>
              <ActionIcon
                variant="filled"
                color="black"
                radius={'lg'}
                size={'lg'}
                aria-label="Tilbage"
                onClick={scrollPrev}
              >
                <IconArrowLeft stroke={1.5} />
              </ActionIcon>
              <ActionIcon
                variant="filled"
                color="black"
                radius={'lg'}
                size={'lg'}
                aria-label="Right"
                onClick={scrollNext}
              >
                <IconArrowRight stroke={1.5} />
              </ActionIcon>
            </Group>
          </Flex>
        </Stack>
      </Wrapper>
    </div>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery>;
}) {
  return (
    <div
      style={{
        overflow: 'hidden',
      }}
    >
      <Wrapper>
        <Stack gap="lg">
          <Group gap="2">
            <Title order={2} fw={500} lts="1px" c="orange">
              Anbefalt produkter
            </Title>
            <ActionIcon
              variant="transparent"
              color="orange"
              size="lg"
              aria-label="Settings"
              component={Link}
              to="/collections"
            >
              <IconArrowRight
                style={{width: '70%', height: '70%'}}
                stroke={1.5}
              />
            </ActionIcon>
          </Group>
          <Suspense fallback={<div>Loading...</div>}>
            <Await resolve={products}>
              {({products}) => {
                return (
                  <Slider>
                    {products.nodes.map((product) => (
                      <Carousel.Slide key={product.id}>
                        <ProductCard product={product} loading="eager" />
                      </Carousel.Slide>
                    ))}
                  </Slider>
                );
              }}
            </Await>
          </Suspense>
        </Stack>
      </Wrapper>
    </div>
  );
}

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: UPDATED_AT, reverse: true, query: "tag:products") {
      nodes {
        ...ProductItem
      }
    }
  }
` as const;

const RECOMMENDED_TREATMENT_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query RecommendedTreatments ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: RELEVANCE, reverse: true, query: "tag:treatments") {
      nodes {
        ...ProductItem
      }
    }
  }
` as const;
