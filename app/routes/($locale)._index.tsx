import {Carousel} from '@mantine/carousel';
import {
  Container,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
  rem,
} from '@mantine/core';
import {Await, useLoaderData, type MetaFunction} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import type {
  RecommendedProductsQuery,
  RecommendedTreatmentsQuery,
} from 'storefrontapi.generated';
import {FrontpageHero} from '~/components/Hero';
import {ProductCard} from '~/components/ProductCard';
import {ArtistCard} from '~/components/artists/ArtistCard';
import {TreatmentCard} from '~/components/treatment/TreatmentCard';

import {PRODUCT_ITEM_FRAGMENT} from '~/data/fragments';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {
  type ProductsGetUsersResponse,
  type UsersListResponse,
} from '~/lib/api/model';

export const meta: MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);
  const recommendedTreatments = await storefront.query(
    RECOMMENDED_TREATMENT_QUERY,
  );

  const {payload: recommendedTreatmentsProductsUsers} =
    await getBookingShopifyApi().productsGetUsers({
      productIds:
        recommendedTreatments?.products.nodes.map((p) => parseGid(p.id).id) ||
        [],
    });

  const artists = getBookingShopifyApi().usersList({
    limit: '8',
    sortOrder: 'desc',
  });

  return defer({
    recommendedProducts,
    recommendedTreatmentsProductsUsers,
    recommendedTreatments,
    artists,
  });
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <FrontpageHero />
      <Container size="xl" py="xl">
        <Stack gap={rem(64)}>
          <FeaturedArtists artists={data.artists} />
          <RecommendedTreatments
            products={data.recommendedTreatments}
            productsUsers={data.recommendedTreatmentsProductsUsers}
          />
          <RecommendedProducts products={data.recommendedProducts} />
        </Stack>
      </Container>
    </>
  );
}

function FeaturedArtists({artists}: {artists: Promise<UsersListResponse>}) {
  if (!artists) return null;
  return (
    <Stack gap="lg">
      <span>
        <Title order={2} fw={400} mb="xs">
          Skønhedseksperter
        </Title>
        <Text c="dimmed">Vælge en af skønhedseksperter.</Text>
      </span>
      <Suspense
        fallback={
          <Group>
            <Skeleton height={50} mb="xl" />
          </Group>
        }
      >
        <Await resolve={artists}>
          {({payload}) => (
            <Carousel
              slideSize={{base: '50%', md: '20%', sm: '33.333%'}}
              slideGap="sm"
              align="start"
              containScroll="keepSnaps"
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
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery>;
}) {
  return (
    <Stack gap="lg">
      <span>
        <Title order={2} fw={400} mb="xs">
          Anbefalt produkter
        </Title>
        <Text c="dimmed">Nogle produkter som kunder har købt.</Text>
      </span>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {({products}) => (
            <SimpleGrid cols={{base: 1, md: 3, lg: 4}}>
              {products.nodes.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  loading="eager"
                />
              ))}
            </SimpleGrid>
          )}
        </Await>
      </Suspense>
    </Stack>
  );
}

function RecommendedTreatments({
  products,
  productsUsers,
}: {
  products: RecommendedTreatmentsQuery;
  productsUsers: ProductsGetUsersResponse[];
}) {
  return (
    <Stack gap="lg">
      <span>
        <Title order={2} fw={400} mb="xs">
          Anbefalt behandlinger
        </Title>
        <Text c="dimmed">Behandlinger du kan være interesseret i.</Text>
      </span>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {({products}) => (
            <SimpleGrid cols={{base: 1, md: 3, lg: 4}}>
              {products.nodes.map((product) => {
                const productUsers = productsUsers.find(
                  (p) => p.productId.toString() === parseGid(product.id).id,
                );

                return (
                  <TreatmentCard
                    key={product.id}
                    product={product}
                    productUsers={productUsers}
                    loading={'eager'}
                  />
                );
              })}
            </SimpleGrid>
          )}
        </Await>
      </Suspense>
    </Stack>
  );
}

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true, query: "tag:products") {
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
    products(first: 4, sortKey: RELEVANCE, reverse: true, query: "tag:treatments") {
      nodes {
        ...ProductItem
      }
    }
  }
` as const;
