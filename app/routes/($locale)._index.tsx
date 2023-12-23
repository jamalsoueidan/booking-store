import {Carousel} from '@mantine/carousel';
import {
  Accordion,
  ActionIcon,
  Box,
  Container,
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
import {Suspense} from 'react';
import type {
  FaqFragment,
  FaqPagesQuestionsQuery,
  RecommendedProductsQuery,
  RecommendedTreatmentsQuery,
} from 'storefrontapi.generated';
import {Hero} from '~/components/Hero';
import {ProductCard} from '~/components/ProductCard';
import {ArtistCard} from '~/components/artists/ArtistCard';
import {TreatmentCard} from '~/components/treatment/TreatmentCard';

import {useMediaQuery} from '@mantine/hooks';
import {IconArrowRight} from '@tabler/icons-react';
import HeroCategories from '~/components/HeroCategories';
import {Wrapper} from '~/components/Wrapper';
import {PRODUCT_ITEM_FRAGMENT} from '~/data/fragments';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import type {ProductsGetUsersImage, UsersListResponse} from '~/lib/api/model';
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

  const {page: faqPage} = await context.storefront.query(FAQ_QUERY);

  const embeddedQuestionPages = convertToEmbedArray(
    faqPage?.metafield?.value || '',
  );

  const faqQuestions = context.storefront.query(FAQ_QUESTIONS_QUERY, {
    variables: {
      query: embeddedQuestionPages.map((p) => parseGid(p).id).join(' OR '),
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  return defer({
    recommendedProducts,
    recommendedTreatmentsProductsUsers,
    recommendedTreatments,
    collections,
    artists,
    faqQuestions,
    faqPage,
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
        <HeroCategories collections={data.collections.nodes} />
      </Container>

      <Box>
        <FeaturedArtists artists={data.artists} />
        <RecommendedTreatments
          products={data.recommendedTreatments}
          productsUsers={data.recommendedTreatmentsProductsUsers}
        />
        <RecommendedProducts products={data.recommendedProducts} />
        <FaqQuestions page={data.faqPage} questions={data.faqQuestions} />
      </Box>
    </>
  );
}

function FeaturedArtists({artists}: {artists: Promise<UsersListResponse>}) {
  if (!artists) return null;
  return (
    <Wrapper>
      <Stack gap="lg">
        <Group gap="2">
          <Title order={2} fw={600} c="pink" lts="1px">
            Skønhedseksperter
          </Title>
          <ActionIcon
            variant="transparent"
            color="pink"
            size="lg"
            aria-label="Settings"
            component={Link}
            to="/artists"
          >
            <IconArrowRight
              style={{width: '70%', height: '70%'}}
              stroke={1.5}
            />
          </ActionIcon>
        </Group>
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
                slideGap="lg"
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
    </Wrapper>
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
    <Wrapper bg="pink.1" py={'xl'}>
      <Stack gap="lg">
        <Group gap="2">
          <Title order={2} fw={500} lts="1px" c="black">
            Anbefalt behandlinger
          </Title>
          <ActionIcon
            variant="transparent"
            color="black"
            size="lg"
            aria-label="Settings"
            component={Link}
            to="/treatments"
          >
            <IconArrowRight
              style={{width: '70%', height: '70%'}}
              stroke={1.5}
            />
          </ActionIcon>
        </Group>

        <Suspense fallback={<div>Loading...</div>}>
          <Await resolve={products}>
            {({products}) => (
              <Carousel
                slideSize={{base: '75%', md: '25%'}}
                slideGap="lg"
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
                      <TreatmentCard
                        product={product}
                        productUsers={productUsers}
                        loading={'eager'}
                      />
                    </Carousel.Slide>
                  );
                })}
              </Carousel>
            )}
          </Await>
        </Suspense>
      </Stack>
    </Wrapper>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery>;
}) {
  return (
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
            {({products}) => (
              <Carousel
                slideSize={{base: '75%', md: '28%'}}
                slideGap="lg"
                align="start"
                containScroll="trimSnaps"
                withControls={false}
              >
                {products.nodes.map((product) => (
                  <Carousel.Slide key={product.id}>
                    <ProductCard product={product} loading="eager" />
                  </Carousel.Slide>
                ))}
              </Carousel>
            )}
          </Await>
        </Suspense>
      </Stack>
    </Wrapper>
  );
}

function FaqQuestions({
  page,
  questions,
}: {
  page?: FaqFragment | null;
  questions: Promise<FaqPagesQuestionsQuery>;
}) {
  return (
    <Wrapper bg="yellow.1" variant="frontpage">
      <SimpleGrid cols={{base: 1, md: 2}}>
        <div>
          <Title order={2} fw={500} fz={rem(60)} lts="1px">
            {page?.title}
          </Title>
          <Text
            size="lg"
            fw={400}
            dangerouslySetInnerHTML={{__html: page?.body || ''}}
          ></Text>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <Await resolve={questions}>
            {({pages}) => (
              <Accordion variant="filled">
                {pages.nodes.map((page) => (
                  <Accordion.Item key={page.id} value={page.title}>
                    <Accordion.Control>
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
            )}
          </Await>
        </Suspense>
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
  fragment Faq on Page {
    id
    title
    body
    metafield(namespace:"custom", key: "faq") {
      id
      value
    }
  }
` as const;

const FAQ_QUERY = `#graphql
  ${FAQ_FRAGMENT}
  query FaqQuestions ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    page(handle: "sporgsmal") {
      ...Faq
    }
  }
` as const;

const FAQ_QUESTIONS_QUERY = `#graphql
  ${FAQ_FRAGMENT}
  query FaqPagesQuestions ($country: CountryCode, $language: LanguageCode, $query: String)
    @inContext(country: $country, language: $language) {
    pages(first: 10, query: $query) {
      nodes {
        ...Faq
      }
    }
  }
` as const;
