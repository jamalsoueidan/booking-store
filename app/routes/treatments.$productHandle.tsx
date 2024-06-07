import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Drawer,
  Flex,
  Grid,
  Group,
  rem,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
  UnstyledButton,
  type UnstyledButtonProps,
} from '@mantine/core';
import {Link, useLoaderData, useSearchParams} from '@remix-run/react';
import {
  UNSTABLE_Analytics as Analytics,
  getPaginationVariables,
  Pagination,
  parseGid,
} from '@shopify/hydrogen';
import {
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@shopify/remix-oxygen';
import {ClientOnly} from 'remix-utils/client-only';

import {PriceBadge} from '~/components/artist/PriceBadge';
import {ProfessionTranslations} from './api.users.professions';

import {useDisclosure} from '@mantine/hooks';
import type {
  ProductCollectionSortKeys,
  ProductFilter,
} from '@shopify/hydrogen/storefront-api-types';
import {IconArrowDown, IconArrowsSort, IconFilter} from '@tabler/icons-react';
import leafletStyles from 'leaflet/dist/leaflet.css?url';
import React from 'react';
import type {
  TreatmentsForCollectionFragment,
  UserCollectionFragment,
} from 'storefrontapi.generated';
import {AddCityFilter} from '~/components/filters/CityFilter';
import {AddDayFilter} from '~/components/filters/DayFilter';
import {AddLocationFilter} from '~/components/filters/LocationFilter';
import {AddPriceFilter} from '~/components/filters/PriceFilter';
import {ResetFilter} from '~/components/filters/ResetFilter';
import {LeafletMap} from '~/components/LeafletMap.client';
import {LocationIcon} from '~/components/LocationIcon';
import type {CustomerLocationBaseLocationType} from '~/lib/api/model';
import {durationToTime} from '~/lib/duration';

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: leafletStyles,
  },
];

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `BySisters | ${data?.product.title ?? ''}`}];
};

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

  if (!product.collection?.reference) {
    throw new Response(`Product > collection not found`, {
      status: 404,
    });
  }

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 5,
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

  const filters: ProductFilter[] = [
    {productMetafield: {namespace: 'system', key: 'default', value: 'true'}},
    {
      productMetafield: {
        namespace: 'booking',
        key: 'hide_from_profile',
        value: 'false',
      },
    },
    {productMetafield: {namespace: 'system', key: 'active', value: 'true'}},
  ];

  const city = searchParams.get('city');
  if (city) {
    filters.push({tag: `city-${city}`});
  }

  const location = searchParams.get('location');
  if (location) {
    filters.push({tag: `location_type-${location}`});
  }

  const price = searchParams.get('price');
  if (price) {
    const [min, max] = price.split(',').map(Number);
    filters.push({price: {min, max}});
  }

  const {collection} = await storefront.query(TREATMENT_COLLECTION, {
    variables: {
      handle: product.collection.reference.handle,
      sortKey,
      reverse,
      filters,
      ...paginationVariables,
    },
    cache: storefront.CacheShort(),
  });

  const {collection: collectionFiltersOnly} = await storefront.query(
    FILTER_COLLECTION,
    {
      variables: {
        handle: product.collection.reference.handle,
      },
      cache: storefront.CacheLong(),
    },
  );

  if (!collection) {
    throw new Response(
      `Collection ${product.collection?.reference?.handle} not found`,
      {
        status: 404,
      },
    );
  }

  return json({
    product,
    collection,
    filters: collectionFiltersOnly?.products.filters || [],
  });
}

interface PriceRange {
  price: {
    min: number;
    max: number;
  };
}

export default function Product() {
  const {product, collection, filters} = useLoaderData<typeof loader>();
  const [, setSearchParams] = useSearchParams();
  const [opened, {open, close}] = useDisclosure(false);

  const price = filters.find((p) => p.id === 'filter.v.price')?.values[0];

  const priceRange = price
    ? (JSON.parse(price.input as string) as PriceRange)
    : {price: {min: 0, max: 0}};

  const tags = filters.find((p) => p.id === 'filter.p.tag');

  const availability = filters
    .find((k) => k.id === 'filter.v.availability')
    ?.values.find((p) => (p.input as any)?.includes('true')) || {count: 0};

  const cities =
    tags?.values
      .filter((p) => p.label.includes('city'))
      .map((c) => {
        const [tag, ...rest] = c.label.split('-');
        return rest.join('-');
      }) || [];

  const cityCount =
    tags?.values
      .filter((p) => p.label.includes('city'))
      .reduce((total, city) => {
        return total + city.count;
      }, 0) || 0;

  const locations =
    tags?.values
      .filter((p) => p.label.includes('location_type'))
      .map((c) => {
        const [tag, ...rest] = c.label.split('-');
        return rest.join('-');
      }) || [];

  const onChangeSort = (value: string | null) => {
    setSearchParams(
      (prev) => {
        if (value) {
          prev.set('sort', value.toLowerCase());
        } else {
          prev.delete('sort');
        }
        return prev;
      },
      {preventScrollReset: true},
    );
  };

  return (
    <Container size="xl">
      <Flex direction="column" mt={rem(100)} gap="xs">
        <Avatar
          alt={product.featuredImage?.altText || 'Product Image'}
          src={product.featuredImage?.url}
          size={rem(150)}
          style={{border: '3px solid rgba(243, 175, 228, 0.7)'}}
        />

        <Title order={1}>{product?.title}</Title>

        <Text size="xl" c="dimmed" fw={400}>
          {product.description}
        </Text>
      </Flex>

      <Card
        radius="md"
        withBorder
        bg="rgba(243, 175, 228, 0.15)"
        style={{border: '1px solid rgba(243, 175, 228, 0.25)'}}
        mt={rem(15)}
        mb={rem(30)}
      >
        <Flex
          direction={{base: 'column', sm: 'row'}}
          justify="space-between"
          gap="md"
        >
          <Flex gap="xl">
            <Flex direction="column">
              <Text tt="uppercase" ta="center" fz="sm" c="gray" fw="400">
                Kategori
              </Text>
              <Text ta="center" fw="600">
                {product.productType}
              </Text>
            </Flex>
            <Flex direction="column">
              <Text tt="uppercase" ta="center" fz="sm" c="gray" fw="400">
                Skønhedseksperter
              </Text>
              <Text ta="center" fw="600">
                {availability?.count}
              </Text>
            </Flex>
            <Flex direction="column">
              <Text tt="uppercase" ta="center" fz="sm" c="gray" fw="400">
                Byer
              </Text>
              <Text ta="center">{cityCount}</Text>
            </Flex>
          </Flex>

          <Flex justify="flex-end" gap="md">
            <ResetFilter />
            <Button
              variant="outline"
              c="black"
              color="gray.3"
              bg="white"
              onClick={open}
              size="xl"
              leftSection={<IconFilter />}
              rightSection={<IconArrowDown />}
            >
              Filtre
            </Button>
          </Flex>
        </Flex>
      </Card>

      <Drawer
        position="right"
        opened={opened}
        onClose={close}
        overlayProps={{backgroundOpacity: 0.3, blur: 2}}
      >
        <Stack gap="xl">
          <AddCityFilter tags={cities} />
          <Select
            size="md"
            label="Sortere efter:"
            placeholder="Vælg sortering"
            onChange={onChangeSort}
            leftSection={<IconArrowsSort />}
            data={[
              {label: 'Nyeste', value: 'newest'},
              {label: 'Billigst', value: 'cheapest'},
              {label: 'Dyrest', value: 'expensive'},
            ]}
            clearable
          />
          <AddPriceFilter
            min={priceRange.price.min}
            max={priceRange.price.max}
          />
          <AddLocationFilter tags={locations} />
          <AddDayFilter />
        </Stack>
      </Drawer>

      <Pagination connection={collection.products}>
        {({nodes, isLoading, PreviousLink, NextLink}) => (
          <Stack gap="xl" mb={rem(50)}>
            <Flex justify="center">
              <Button
                variant="default"
                component={PreviousLink}
                loading={isLoading}
                size="xl"
              >
                ↑ Hent tidligere
              </Button>
            </Flex>
            <SimpleGrid cols={{base: 1, sm: 2}}>
              <Flex direction="column" gap="lg">
                {nodes.map((product) => {
                  return (
                    <TreatmentProductUser key={product.id} product={product} />
                  );
                })}
              </Flex>
              <Box pos="relative">
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
                  {() => <LeafletMap />}
                </ClientOnly>
              </Box>
            </SimpleGrid>
            <Flex justify="center">
              <Button
                variant="default"
                component={NextLink}
                loading={isLoading}
                size="xl"
              >
                Hent flere ↓
              </Button>
            </Flex>
          </Stack>
        )}
      </Pagination>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: product.variants.nodes[0].price.amount || '0',
              vendor: product.vendor,
              variantId: product.variants.nodes[0].id || '',
              variantTitle: product.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </Container>
  );
}

function TreatmentProductUser({
  product,
}: {
  product: TreatmentsForCollectionFragment;
}) {
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
      <UnstyledButton component={Link} to={`/artist/${user.username?.value}`}>
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
                    {ProfessionTranslations[p]}
                  </Badge>
                ))}
              </Flex>
            </Stack>
          </Flex>
          <Flex visibleFrom="sm" align="center">
            <Button variant="outline" c="black" color="gray.3" radius="lg">
              Vis profil
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
        .map((p, index) => (
          <React.Fragment key={p.id}>
            <Card.Section>
              <Divider my="xs" color="gray.2" />
            </Card.Section>
            <ArtistProduct
              user={user}
              product={p}
              style={{opacity: Math.max(0.5 - index * 0.2, 0)}}
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
          to={`/artist/${user.username?.value}`}
          w="100%"
        >
          Vis profil
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
      to={`/artist/${user.username?.value}/treatment/${product.handle}`}
      {...props}
    >
      <Grid>
        <Grid.Col span={8}>
          <Flex direction="column" gap="xs">
            <div>
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
            </div>
          </Flex>
        </Grid.Col>
        <Grid.Col span={4}>
          <Flex justify="flex-end" align="center" h="100%">
            <PriceBadge
              compareAtPrice={product.variants.nodes[0].compareAtPrice}
              price={product.variants.nodes[0].price}
              fw="600"
            />
          </Flex>
        </Grid.Col>
      </Grid>
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
      url(transform: { maxHeight: 500, maxWidth: 500, crop: CENTER })
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
    aboutMe: field(key: "about_me") {
      value
    }
    active: field(key: "active") {
      value
    }
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
    theme: field(key: "theme") {
      value
    }
    image: field(key: "image") {
      reference {
        ... on MediaImage {
          image {
            width
            height
            url(transform: { maxHeight: 250, maxWidth: 250, crop: CENTER })
          }
        }
      }
    }
    collection: field(key: "collection") {
      reference {
        ... on Collection {
          id
          products(first: 2, sortKey: BEST_SELLING, filters: [{tag: "treatments"}, {productMetafield: {namespace: "booking",key: "hide_from_profile",value: "false"}}]) {
            nodes {
              id
              title
              description
              handle
              vendor
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
    description
    handle
    vendor
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
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $filters: [ProductFilter!]!
    $reverse: Boolean = true
    $sortKey: ProductCollectionSortKeys = PRICE
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        filters: $filters,
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
  }
` as const;

const FILTER_COLLECTION = `#graphql
  query TreatmentFilterCollection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(first: 1) {
        filters {
          id
          label
          values {
            input
            label
            count
          }
        }
      }
    }
  }
` as const;
