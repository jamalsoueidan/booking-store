import {Carousel} from '@mantine/carousel';
import {
  Avatar,
  Button,
  Container,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {Await, Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {HeroImageRight} from '~/components/Hero';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type UsersListResponse} from '~/lib/api/model';

export const meta: MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  const featuredCollection = collections.nodes[0];
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  const artists = getBookingShopifyApi().usersList({
    limit: '8',
    sortOrder: 'desc',
  });

  return defer({featuredCollection, recommendedProducts, artists});
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <Container fluid py="xl">
      <Stack gap="lg">
        <HeroImageRight />
        <FeaturedArtists artists={data.artists} />
        <FeaturedCollection collection={data.featuredCollection} />
        <RecommendedProducts products={data.recommendedProducts} />
      </Stack>
    </Container>
  );
}

function FeaturedArtists({artists}: {artists: Promise<UsersListResponse>}) {
  if (!artists) return null;
  return (
    <div className="featured-artists">
      <Title order={2} mb="sm">
        Skønhedseksperter
      </Title>
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
              slideSize={{base: '100%', md: '20%', sm: '33.333%'}}
              slideGap="sm"
              align="start"
              containScroll="keepSnaps"
              withControls={false}
            >
              {payload.results.map((artist) => (
                <Carousel.Slide key={artist.customerId}>
                  <Paper
                    radius="md"
                    withBorder
                    p="lg"
                    bg="var(--mantine-color-body)"
                    component={Link}
                    to={`/artist/${artist.username}`}
                  >
                    <Avatar
                      src={artist.images?.profile?.url}
                      size={120}
                      radius={120}
                      mx="auto"
                    />
                    <Text ta="center" fz="lg" fw={500} mt="md" c="black">
                      {artist.fullname}
                    </Text>
                    <Text ta="center" c="dimmed" fz="sm">
                      {artist.shortDescription}
                    </Text>

                    <Button variant="default" fullWidth mt="md">
                      Vis profile
                    </Button>
                  </Paper>
                </Carousel.Slide>
              ))}
            </Carousel>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <Title>{collection.title}</Title>
    </Link>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery>;
}) {
  return (
    <div className="recommended-products">
      <Title order={2}>Recommended Products</Title>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {({products}) => (
            <div className="recommended-products-grid">
              {products.nodes.map((product) => (
                <Link
                  key={product.id}
                  className="recommended-product"
                  to={`/products/${product.handle}`}
                >
                  <Image
                    data={product.images.nodes[0]}
                    aspectRatio="1/1"
                    sizes="(min-width: 45em) 20vw, 50vw"
                  />
                  <h4>{product.title}</h4>
                  <small>
                    <Money data={product.priceRange.minVariantPrice} />
                  </small>
                </Link>
              ))}
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
