import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  rem,
  SimpleGrid,
  Stack,
  Text,
  Title,
  UnstyledButton,
  type UnstyledButtonProps,
} from '@mantine/core';
import {Link, useLoaderData, useSearchParams} from '@remix-run/react';
import {getPaginationVariables, Pagination, parseGid} from '@shopify/hydrogen';
import {
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {ClientOnly} from 'remix-utils/client-only';

import {PriceBadge} from '~/components/artist/PriceBadge';

import type {ProductCollectionSortKeys} from '@shopify/hydrogen/storefront-api-types';
import React from 'react';
import type {
  TreatmentsForCollectionFragment,
  UserCollectionFragment,
} from 'storefrontapi.generated';
import {LeafletMap} from '~/components/LeafletMap.client';
import {LocationIcon} from '~/components/LocationIcon';
import type {CustomerLocationBaseLocationType} from '~/lib/api/model';
import {useDuration} from '~/lib/duration';

import leafletStyles from 'leaflet/dist/leaflet.css?url';
import {useTranslation} from 'react-i18next';
import localLeafletStyles from '~/styles/leaflet.css?url';

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: leafletStyles,
  },
  {
    rel: 'stylesheet',
    href: localLeafletStyles,
  },
];

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {productHandle} = params;
  const {storefront} = context;

  if (!productHandle) {
    throw new Error('Expected product handle to be defined');
  }

  const {product} = await storefront.query(
    GET_TREATMENT_WITH_COLLECTION_HANDLE,
    {
      variables: {
        productHandle,
      },
      cache: storefront.CacheLong(),
    },
  );

  if (!product) {
    throw new Response(`Product ${productHandle} not found`, {
      status: 404,
    });
  }

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 10,
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  let sortKey: ProductCollectionSortKeys = 'RELEVANCE';
  let reverse = false;

  const sort = searchParams.get('sort');
  if (sort === 'newest') {
    sortKey = 'CREATED';
    reverse = true;
  } else if (sort === 'cheapest') {
    sortKey = 'PRICE';
    reverse = false;
  } else if (sort === 'expensive') {
    sortKey = 'PRICE';
    reverse = true;
  }

  const filters = [
    `tag:"parentid-${parseGid(product.id).id}"`,
    'tag:"treatments"',
    'tag_not:"hide-from-profile"',
    // missing active {productMetafield: {namespace: 'system', key: 'active', value: 'true'}},
    // missing default {productMetafield: {namespace: 'system', key: 'default', value: 'true'}},
  ];

  const city = searchParams.get('city');
  if (city) {
    filters.push(`tag:"city-${city}"`);
  }

  const location = searchParams.get('location');
  if (location) {
    filters.push(`tag:"location_type-${location}"`);
  }

  const price = searchParams.get('price');
  if (price) {
    const [min, max] = price.split(',').map(Number);
    filters.push(`variants.price:>=${min} AND variants.price:<=${max}`);
  }

  const days = searchParams.get('days');
  if (days) {
    const d = days.split(',');
    filters.push(`tag:day-${d.join(' OR tag:day-')}`);
  }

  const {products} = await storefront.query(TREATMENT_COLLECTION, {
    variables: {
      query: filters.join(' AND '),
      sortKey: 'PRICE',
      reverse,
      ...paginationVariables,
    },
    cache: storefront.CacheShort(),
  });

  return json({
    products,
  });
}

export default function PaginationContent() {
  const {products} = useLoaderData<typeof loader>();
  const {t} = useTranslation();
  const [searchParams] = useSearchParams();
  const map = String(searchParams.get('map'));

  return (
    <Pagination connection={products}>
      {({nodes, isLoading, PreviousLink, NextLink, hasPreviousPage}) => (
        <Stack gap="xl" mb={rem(50)}>
          <SimpleGrid cols={map === 'hide' ? {base: 1} : {base: 1, sm: 2}}>
            <Stack gap="xl">
              {hasPreviousPage ? (
                <Flex justify="center">
                  <Button
                    variant="default"
                    component={PreviousLink}
                    loading={isLoading}
                    size="xl"
                  >
                    ↑ {t('pagination_previous_button')}
                  </Button>
                </Flex>
              ) : null}

              <SimpleGrid cols={map === 'hide' ? {base: 1, sm: 3} : {base: 1}}>
                {nodes.map((product) => (
                  <TreatmentProductUser key={product.id} product={product} />
                ))}
              </SimpleGrid>

              <Flex justify="center">
                <Button
                  variant="default"
                  component={NextLink}
                  loading={isLoading}
                  size="xl"
                >
                  {t('pagination_next_button')} ↓
                </Button>
              </Flex>
            </Stack>
            {map !== 'hide' ? (
              <Box pos="relative">
                <div style={{position: 'sticky', top: 0}}>
                  <ClientOnly
                    fallback={
                      <div
                        id="skeleton"
                        style={{
                          height: '100vh',
                          border: '1px solid #dee2e6',
                          borderRadius: '10px',
                          background: '#d1d1d1',
                        }}
                      />
                    }
                  >
                    {() => <LeafletMap products={nodes} />}
                  </ClientOnly>
                </div>
              </Box>
            ) : null}
          </SimpleGrid>
        </Stack>
      )}
    </Pagination>
  );
}

function TreatmentProductUser({
  product,
}: {
  product: TreatmentsForCollectionFragment;
}) {
  const {t} = useTranslation(['treatments', 'professions']);
  const user = product.user?.reference;

  if (!user) {
    return null;
  }

  const userProducts =
    product.user?.reference?.collection?.reference?.products.nodes ?? [];
  const {professions} = user?.professions?.value
    ? (JSON.parse(user?.professions?.value) as Record<string, []>)
    : {professions: []};

  return (
    <Card withBorder radius="md" pb="xs">
      <UnstyledButton component={Link} to={`/${user.username?.value}`}>
        <Flex justify="space-between">
          <Flex gap="lg" align="center">
            <Avatar src={user.image?.reference?.image?.url} size={rem(90)} />
            <Stack gap="0">
              <Text fw={600} size="xl">
                {user.fullname?.value}
              </Text>
              <Text c="dimmed" lineClamp={1}>
                {user.shortDescription?.value}
              </Text>
              <Flex gap="xs" mt={rem(8)} wrap="wrap">
                {professions.map((p) => (
                  <Badge
                    variant="outline"
                    c="black"
                    color="gray.4"
                    key={p}
                    fw="400"
                  >
                    {t(p, {ns: 'professions'})}
                  </Badge>
                ))}
              </Flex>
            </Stack>
          </Flex>
          <Flex visibleFrom="sm" align="center">
            <Button variant="outline" c="black" color="gray.3" radius="lg">
              {t('view_profile')}
            </Button>
          </Flex>
        </Flex>
      </UnstyledButton>

      <Card.Section>
        <Divider mt="md" mb="xs" color="gray.2" />
      </Card.Section>

      <ArtistProduct user={user} product={product} />

      {userProducts
        .filter((p) => p.id !== product.id)
        .slice(0, 2)
        .map((p, index) => (
          <React.Fragment key={p.id}>
            <Card.Section>
              <Divider my="xs" color="gray.2" />
            </Card.Section>
            <ArtistProduct
              user={user}
              product={p}
              //style={{opacity: Math.max(0.5 - index * 0.1, 0)}}
            />
          </React.Fragment>
        ))}

      <Box hiddenFrom="sm" mt="sm">
        <Card.Section>
          <Divider mt="xs" mb="sm" color="gray.2" />
        </Card.Section>
        <Button
          variant="outline"
          c="black"
          color="gray.3"
          radius="lg"
          component={Link}
          to={`/${user.username?.value}`}
          w="100%"
        >
          {t('view_profile')}
        </Button>
      </Box>
    </Card>
  );
}

export function ArtistProduct({
  user,
  product,
  ...props
}: {
  user: UserCollectionFragment;
  product: TreatmentsForCollectionFragment;
} & UnstyledButtonProps) {
  const productId = parseGid(product?.id).id;
  const durationToTime = useDuration();
  const locations =
    product.locations?.references?.nodes.map((p) => ({
      locationType: p.locationType?.value as CustomerLocationBaseLocationType,
    })) || [];

  const sortAndRemoveDuplicates = (
    locations: Array<{
      locationType: CustomerLocationBaseLocationType;
    }>,
  ) => {
    const locationTypes = locations.map((loc) => loc.locationType);
    const uniqueLocationTypes = [...new Set(locationTypes)];
    return uniqueLocationTypes.sort().map((locationType) => ({locationType}));
  };

  const sortedLocations = sortAndRemoveDuplicates(locations);

  return (
    <UnstyledButton
      component={Link}
      data-testid={`service-item-${productId}`}
      to={`/book/${product.handle}`}
      {...props}
    >
      <Flex justify="space-between">
        <Flex direction="column" gap="4px">
          <Group gap="xs">
            <Title
              order={2}
              size="md"
              fw={500}
              lts=".5px"
              data-testid={`service-title-${productId}`}
            >
              {product.title}
            </Title>
            <Flex gap="4px">
              {sortedLocations.map((location) => (
                <LocationIcon
                  key={location.locationType}
                  location={location}
                  style={{width: 18, height: 18}}
                />
              ))}
            </Flex>
          </Group>

          <Text
            c="dimmed"
            size="sm"
            data-testid={`service-duration-text-${productId}`}
          >
            {durationToTime(product.duration?.value || 0)}
          </Text>
        </Flex>
        <Flex justify="flex-end" align="center" h="100%">
          <PriceBadge
            compareAtPrice={product.variants.nodes[0].compareAtPrice}
            price={product.variants.nodes[0].price}
            fw="600"
          />
        </Flex>
      </Flex>
    </UnstyledButton>
  );
}

const TREATMENT_WITH_COLLECTION_HANDLER_FRAGMENT = `#graphql
  fragment TreatmentWithCollectionHandler on Product {
    id
    title
    description
    productType
    handle
    vendor
    featuredImage {
      id
      altText
      url(transform: { maxHeight: 250, maxWidth: 250, crop: CENTER })
      width
      height
    }
    variants(first: 1) {
      nodes {
        id
        compareAtPrice {
          amount
          currencyCode
        }
        price {
          amount
          currencyCode
        }
      }
    }
    collection: metafield(key: "collection", namespace: "system") {
      reference {
        ... on Collection {
          handle
          title
        }
      }
    }
  }
` as const;

const USER_COLLECTION_FRAGMENT = `#graphql
  fragment UserCollection on Metaobject {
    id
    fullname: field(key: "fullname") {
      value
    }
    professions: field(key: "professions") {
      value
    }
    shortDescription: field(key: "short_description") {
      value
    }
    username: field(key: "username") {
      value
    }
    image: field(key: "image") {
      reference {
        ... on MediaImage {
          image {
            width
            height
            url(transform: { maxHeight: 100, maxWidth: 100, crop: CENTER })
          }
        }
      }
    }
    collection: field(key: "collection") {
      reference {
        ... on Collection {
          id
          products(first: 3, sortKey: BEST_SELLING, filters: [{productMetafield: {namespace: "system", key: "type", value: "product"}}, {productMetafield: {namespace: "booking",key: "hide_from_profile",value: "false"}}]) {
            nodes {
              id
              title
              handle
              productType
              variants(first: 1) {
                nodes {
                  id
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  price {
                    amount
                    currencyCode
                  }
                }
              }
              duration: metafield(key: "duration", namespace: "booking") {
                id
                value
              }
              locations: metafield(key: "locations", namespace: "booking") {
                references(first: 3) {
                  nodes {
                    ... on Metaobject {
                      id
                      locationType: field(key: "location_type") {
                        value
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
` as const;

const TREATMENTS_FOR_COLLECTION = `#graphql
  ${USER_COLLECTION_FRAGMENT}
  fragment TreatmentsForCollection on Product {
    id
    title
    handle
    productType
    variants(first: 1) {
      nodes {
        id
        compareAtPrice {
          amount
          currencyCode
        }
        price {
          amount
          currencyCode
        }
      }
    }
    locations: metafield(key: "locations", namespace: "booking") {
      references(first: 3) {
        nodes {
          ... on Metaobject {
            id
            locationType: field(key: "location_type") {
              value
            }
            geoLocation: field(key: "geo_location") {
              value
            }
          }
        }
      }
    }
    duration: metafield(key: "duration", namespace: "booking") {
      id
      value
    }
    user: metafield(key: "user", namespace: "booking") {
      reference {
        ...UserCollection
      }
    }

  }
` as const;

const GET_TREATMENT_WITH_COLLECTION_HANDLE = `#graphql
  ${TREATMENT_WITH_COLLECTION_HANDLER_FRAGMENT}

  query GetProductWithCollectionHandle(
    $productHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $productHandle) {
      ...TreatmentWithCollectionHandler
    }
  }
` as const;

const TREATMENT_COLLECTION = `#graphql
  ${TREATMENTS_FOR_COLLECTION}
  query TreatmentCollection(
    $query: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $reverse: Boolean = true
    $sortKey: ProductSortKeys = PRICE
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor,
      query: $query,
      sortKey: $sortKey,
      reverse: $reverse
    ) {
      nodes {
        ...TreatmentsForCollection
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        endCursor
        startCursor
      }
    }
  }
` as const;
