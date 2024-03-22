import {Carousel, type Embla} from '@mantine/carousel';
import {
  ActionIcon,
  Box,
  Button,
  Container,
  Flex,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {Await, Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Suspense, useCallback, useState} from 'react';
import type {
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
import {Faq} from '~/components/metaobjects/Faq';
import {METAFIELD_QUERY, PRODUCT_ITEM_FRAGMENT} from '~/data/fragments';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import type {ProductsGetUsersImage, UsersListResponse} from '~/lib/api/model';

import {ArtistCard} from '~/components/ArtistCard';
import {COLLECTIONS_QUERY} from './($locale).categories._index';

export function shouldRevalidate() {
  return false;
}

export const meta: MetaFunction = () => {
  return [{title: 'BySisters | Home'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);
  const recommendedTreatments = await storefront.query(
    RECOMMENDED_TREATMENT_QUERY,
  );

  const {payload: recommendedTreatmentsProductsUsers} =
    await getBookingShopifyApi().productsGetUsersImage({
      productIds:
        recommendedTreatments?.products.nodes.map((p) => parseGid(p.id).id) ||
        [],
    });

  const artists = getBookingShopifyApi().usersList({
    limit: '8',
    sortOrder: 'desc',
  });

  const {collections} = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: {first: 10},
  });

  const {metaobject: faq} = await context.storefront.query(METAFIELD_QUERY, {
    variables: {
      handle: 'index-faq',
      type: 'faq',
    },
  });

  return defer({
    recommendedProducts,
    recommendedTreatmentsProductsUsers,
    recommendedTreatments,
    collections,
    artists,
    faq,
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

      <Container size="lg" style={{marginTop: '-75px'}}>
        <HeroCategories collections={data.collections.nodes} />
      </Container>

      <Box>
        <FeaturedArtists artists={data.artists} />
        <RecommendedTreatments
          products={data.recommendedTreatments}
          productsUsers={data.recommendedTreatmentsProductsUsers}
        />
        <RecommendedProducts products={data.recommendedProducts} />
        <Faq component={data.faq} />
      </Box>
    </>
  );
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
        <Stack gap="lg">
          <Title order={2} fw={500} lts="1px" c="black">
            Vælg din næste skønhedsoplevelse.
          </Title>

          <Text>
            Udforsk behandlinger, og book din tid – alt sammen på ét sted.
          </Text>

          <span>
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
          </span>

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
