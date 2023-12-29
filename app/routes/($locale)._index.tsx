import {Carousel, type Embla} from '@mantine/carousel';
import {
  Accordion,
  ActionIcon,
  Box,
  Button,
  Container,
  Flex,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
  rem,
} from '@mantine/core';
import {Await, Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Suspense, useCallback, useState} from 'react';
import type {
  FaqFragment,
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
import {PRODUCT_ITEM_FRAGMENT} from '~/data/fragments';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import type {ProductsGetUsersImage, UsersListResponse} from '~/lib/api/model';
import {ArtistCard} from './($locale).artists';
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

  const {metaobject: faq} = await context.storefront.query(FAQ_QUERY);

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

      <Container size="lg" style={{marginTop: '-80px'}}>
        <HeroCategories collections={data.collections.nodes} />
      </Container>

      <Box>
        <FeaturedArtists artists={data.artists} />
        <RecommendedTreatments
          products={data.recommendedTreatments}
          productsUsers={data.recommendedTreatmentsProductsUsers}
        />
        <RecommendedProducts products={data.recommendedProducts} />
        <FaqQuestions faq={data.faq} />
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
      <Wrapper variant="frontpage">
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
        backgroundColor: 'var(--mantine-color-pink-1)',
      }}
    >
      <Wrapper bg="pink.1" variant="frontpage">
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
      <Wrapper variant="frontpage">
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

function FaqQuestions({faq}: {faq?: FaqFragment | null}) {
  if (!faq) {
    return null;
  }

  const title = faq.fields.find((p) => p.key === 'title')?.value || '';
  const description =
    faq.fields.find((p) => p.key === 'description')?.value || '';
  const pages = faq.fields.find((p) => p.key === 'pages');

  return (
    <Wrapper bg="yellow.1" variant="frontpage" mb="0">
      <SimpleGrid cols={{base: 1, md: 2}}>
        <div>
          <Title order={2} fw={500} fz={rem(48)} lts="1px">
            {title}
          </Title>
          <Text size="lg" fw={400}>
            {description}
          </Text>
          <Button color="yellow">Kontakt os</Button>
        </div>
        <Accordion variant="default">
          {pages?.references?.nodes.map((page) => (
            <Accordion.Item key={page.id} value={page.title}>
              <Accordion.Control p={0}>
                <Text fz="lg" fw={500}>
                  {page.title}
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <div dangerouslySetInnerHTML={{__html: page.body}} />
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </SimpleGrid>
    </Wrapper>
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

export const FAQ_FRAGMENT = `#graphql
  fragment Faq on Metaobject {
    id
    fields {
      value
      key
      references(first: 10) {
        nodes {
          ... on Page {
            id
            title
            body
          }
        }
      }
    }
  }
` as const;

const FAQ_QUERY = `#graphql
  ${FAQ_FRAGMENT}
  query FaqQuestions ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    metaobject(handle: {handle: "index-faq", type: "faq"}) {
      ...Faq
    }
  }
` as const;
