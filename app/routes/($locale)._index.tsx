import {Carousel} from '@mantine/carousel';
import {
  ActionIcon,
  Anchor,
  Box,
  Card,
  Container,
  Flex,
  Group,
  Image,
  Skeleton,
  Stack,
  Text,
  Title,
  rem,
} from '@mantine/core';
import {Await, Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import type {
  RecommendedProductsQuery,
  RecommendedTreatmentsQuery,
} from 'storefrontapi.generated';
import {Hero} from '~/components/Hero';
import {ProductCard} from '~/components/ProductCard';
import {ArtistCard} from '~/components/artists/ArtistCard';
import {TreatmentCard} from '~/components/treatment/TreatmentCard';

import {useMediaQuery} from '@mantine/hooks';
import {PRODUCT_ITEM_FRAGMENT} from '~/data/fragments';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import type {ProductsGetUsersImage, UsersListResponse} from '~/lib/api/model';
import {parseTE} from '~/lib/clean';
import {COLLECTIONS_QUERY} from './($locale).categories._index';

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

  return defer({
    recommendedProducts,
    recommendedTreatmentsProductsUsers,
    recommendedTreatments,
    collections,
    artists,
  });
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  const isMobile = useMediaQuery('(max-width: 62em)');

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
        <Card
          bg="white"
          shadow="lg"
          radius="lg"
          px={isMobile ? 'sm' : 'xl'}
          pt={isMobile ? 'md' : 'lg'}
        >
          <Flex gap={isMobile ? 'sm' : 'xl'} wrap="wrap">
            {data.collections.nodes.map((c) => (
              <Anchor
                component={Link}
                to={`/categories/${c.handle}`}
                key={c.id}
                style={{flex: 1}}
              >
                <Flex
                  justify="center"
                  align="center"
                  direction="column"
                  gap="sm"
                >
                  <ActionIcon
                    variant="light"
                    color={c.color?.value || 'yellow'}
                    size={rem(isMobile ? 30 : 60)}
                    radius="xl"
                    aria-label="Settings"
                  >
                    <Image
                      src={`/categories/${
                        c.icon?.value || 'reshot-icon-beauty-mirror'
                      }.svg`}
                      h="80%"
                      w="80%"
                      alt="ok"
                    />
                  </ActionIcon>
                  <Text
                    c="black"
                    fw="500"
                    fz={isMobile ? 12 : undefined}
                    lineClamp={1}
                  >
                    {parseTE(c.title)}
                  </Text>
                </Flex>
              </Anchor>
            ))}
          </Flex>
        </Card>
      </Container>

      <Stack>
        <FeaturedArtists artists={data.artists} />
        <RecommendedTreatments
          products={data.recommendedTreatments}
          productsUsers={data.recommendedTreatmentsProductsUsers}
        />
        <RecommendedProducts products={data.recommendedProducts} />
      </Stack>
    </>
  );
}

function FeaturedArtists({artists}: {artists: Promise<UsersListResponse>}) {
  const isMobile = useMediaQuery('(max-width: 62em)');
  if (!artists) return null;
  return (
    <Box>
      <Container size="lg" pt={isMobile ? '50px' : '100px'} pb="40px">
        <Stack gap="lg">
          <Title order={2} fw={600} c="orange" lts="1px">
            Skønhedseksperter
          </Title>
          <Suspense
            fallback={
              <Group>
                <Skeleton height={50} />
              </Group>
            }
          >
            <Await resolve={artists}>
              {({payload}) => (
                <Carousel
                  slideSize={{base: '75%', md: '25%'}}
                  slideGap="sm"
                  align="start"
                  containScroll="trimSnaps"
                  withControls={false}
                >
                  {payload.results.map((artist) => (
                    <Carousel.Slide key={artist.customerId}>
                      <ArtistCard artist={artist} />
                    </Carousel.Slide>
                  ))}
                </Carousel>
              )}
            </Await>
          </Suspense>
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
  productsUsers: ProductsGetUsersImage[];
}) {
  return (
    <Box bg="pink.1">
      <Container size="lg">
        <Stack gap="lg" py="xl">
          <Title order={2} fw={500} lts="1px">
            Anbefalt behandlinger
          </Title>

          <Suspense fallback={<div>Loading...</div>}>
            <Await resolve={products}>
              {({products}) => (
                <Carousel
                  slideSize={{base: '75%', md: '25%'}}
                  slideGap="0"
                  align="start"
                  containScroll="trimSnaps"
                  withControls={false}
                >
                  {products.nodes.map((product) => {
                    const productUsers = productsUsers.find(
                      (p) => p.productId.toString() === parseGid(product.id).id,
                    );

                    return (
                      <Carousel.Slide key={product.id}>
                        <Box px={rem(6)}>
                          <TreatmentCard
                            product={product}
                            productUsers={productUsers}
                            loading={'eager'}
                          />
                        </Box>
                      </Carousel.Slide>
                    );
                  })}
                </Carousel>
              )}
            </Await>
          </Suspense>
        </Stack>
      </Container>
    </Box>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery>;
}) {
  return (
    <Box>
      <Container size="lg">
        <Stack gap="lg" py="xl">
          <Title order={2} fw={500} lts="1px">
            Anbefalt produkter
          </Title>
          <Suspense fallback={<div>Loading...</div>}>
            <Await resolve={products}>
              {({products}) => (
                <Carousel
                  slideSize={{base: '75%', md: '28%'}}
                  slideGap="0"
                  align="start"
                  containScroll="trimSnaps"
                  withControls={false}
                >
                  {products.nodes.map((product) => (
                    <Carousel.Slide key={product.id}>
                      <Box px={rem(6)}>
                        <ProductCard product={product} loading="eager" />
                      </Box>
                    </Carousel.Slide>
                  ))}
                </Carousel>
              )}
            </Await>
          </Suspense>
        </Stack>
      </Container>
    </Box>
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
