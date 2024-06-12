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

import {useDisclosure} from '@mantine/hooks';
import type {
  ProductCollectionSortKeys,
  ProductFilter,
} from '@shopify/hydrogen/storefront-api-types';
import {
  IconArrowDown,
  IconArrowsSort,
  IconFilter,
  IconGps,
} from '@tabler/icons-react';
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
import {USER_COLLECTION_FILTER} from '~/graphql/fragments/UserCollectionFilter';
import type {CustomerLocationBaseLocationType} from '~/lib/api/model';
import {durationToTime} from '~/lib/duration';
import {TranslationProvider, useTranslations} from '~/providers/Translation';
import localLeafletStyles from '~/styles/leaflet.css?url';
import {PAGE_QUERY} from './pages.$handle';

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

  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: 'treatments',
    },
    cache: context.storefront.CacheLong(),
  });

  return json({
    product,
    collection,
    page,
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
  const {product, page} = useLoaderData<typeof loader>();

  return (
    <TranslationProvider data={page?.translations}>
      <Container size="xl">
        <Header />
        <Stats />

        <PaginationContent />

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
    </TranslationProvider>
  );
}

function Header() {
  const {product, filters} = useLoaderData<typeof loader>();
  const {t} = useTranslations();
  const [searchParams, setSearchParams] = useSearchParams();
  const [opened, {open, close}] = useDisclosure(false);

  const price = filters.find((p) => p.id === 'filter.v.price')?.values[0];

  const priceRange = price
    ? (JSON.parse(price.input as string) as PriceRange)
    : {price: {min: 0, max: 0}};

  const tags = filters.find((p) => p.id === 'filter.p.tag');

  const cities =
    tags?.values
      .filter((p) => p.label.includes('city'))
      .map((c) => {
        const [tag, ...rest] = c.label.split('-');
        return rest.join('-');
      }) || [];

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

  const map = String(searchParams.get('map'));
  const onChangeMap = (value: string | null) => {
    setSearchParams(
      (prev) => {
        if (value) {
          prev.set('map', value);
        } else {
          prev.delete('map');
        }
        return prev;
      },
      {preventScrollReset: true},
    );
  };

  return (
    <>
      <Flex
        direction={{base: 'column', sm: 'row'}}
        mt={rem(100)}
        mb="xl"
        align="center"
        gap="lg"
      >
        <Flex direction="row" gap={{base: 'sm', sm: 'lg'}}>
          <Avatar
            alt={product.featuredImage?.altText || 'Product Image'}
            src={product.featuredImage?.url}
            size={rem(120)}
            style={{border: '3px solid rgba(243, 175, 228, 0.7)'}}
          />
          <Flex direction="column" justify="center">
            <Title order={1} fz={{base: 'xl', sm: 'h1'}} mt="-5px">
              {product?.title}
            </Title>

            <Text fz={{base: 'sm', sm: 'xl'}} c="dimmed" fw={400} lineClamp={3}>
              {product.description}
            </Text>
          </Flex>
        </Flex>
        <Flex justify={{base: 'center', sm: 'flex-end'}} gap="md">
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
            {t('treatments_filter')}
          </Button>
          <Button
            variant="outline"
            c="black"
            color="gray.3"
            bg="white"
            onClick={() => onChangeMap(map === 'hide' ? null : 'hide')}
            size="xl"
            rightSection={<IconGps />}
            visibleFrom="sm"
          >
            {map === 'hide' ? t('show') : t('hide')} {t('treatments_map')}
          </Button>
        </Flex>
      </Flex>

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
            label={t('treatments_sort_label')}
            placeholder={t('treatments_sort_placeholder')}
            onChange={onChangeSort}
            leftSection={<IconArrowsSort />}
            data={[
              {label: t('treatments_sort_newest'), value: 'newest'},
              {label: t('treatments_sort_cheapest'), value: 'cheapest'},
              {label: t('treatments_sort_expensive'), value: 'expensive'},
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
    </>
  );
}

function PaginationContent() {
  const {collection} = useLoaderData<typeof loader>();
  const {t} = useTranslations();
  const [searchParams] = useSearchParams();
  const map = String(searchParams.get('map'));

  return (
    <Pagination connection={collection.products}>
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

function Stats() {
  const {product, filters} = useLoaderData<typeof loader>();
  const {t} = useTranslations();
  const tags = filters.find((p) => p.id === 'filter.p.tag');

  const availability = filters
    .find((k) => k.id === 'filter.v.availability')
    ?.values.find((p) => (p.input as any)?.includes('true')) || {count: 0};

  const cityCount =
    tags?.values
      .filter((p) => p.label.includes('city'))
      .reduce((total, city) => {
        return total + city.count;
      }, 0) || 0;

  return (
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
        gap={{base: 'md'}}
      >
        <Flex gap="xl" wrap="wrap">
          <Flex direction="column" justify="center">
            <Text tt="uppercase" ta="center" fz="sm" c="gray" fw="400">
              {t('treatments_category')}
            </Text>
            <Text ta="center" fw="600">
              {product.productType}
            </Text>
          </Flex>
          <Flex direction="column" justify="center">
            <Text tt="uppercase" ta="center" fz="sm" c="gray" fw="400">
              {t('treatments_beauty_expert')}
            </Text>
            <Text ta="center" fw="600">
              {availability?.count}
            </Text>
          </Flex>
          <Flex direction="column" justify="center">
            <Text tt="uppercase" ta="center" fz="sm" c="gray" fw="400">
              {t('treatments_cities')}
            </Text>
            <Text ta="center">{cityCount}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}

function TreatmentProductUser({
  product,
}: {
  product: TreatmentsForCollectionFragment;
}) {
  const {t} = useTranslations();
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
                    {t(`profession_${p}`)}
                  </Badge>
                ))}
              </Flex>
            </Stack>
          </Flex>
          <Flex visibleFrom="sm" align="center">
            <Button variant="outline" c="black" color="gray.3" radius="lg">
              {t('treatments_view_profile')}
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
          products(first: 3, sortKey: BEST_SELLING, filters: [{tag: "treatments"}, {productMetafield: {namespace: "booking",key: "hide_from_profile",value: "false"}}]) {
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
  ${USER_COLLECTION_FILTER}
  query TreatmentFilterCollection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(first: 1) {
        filters {
          ...UserCollectionFilter
        }
      }
    }
  }
` as const;
