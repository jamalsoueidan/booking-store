import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Drawer,
  Flex,
  getGradient,
  Group,
  Radio,
  rem,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {
  Link,
  useLoaderData,
  useSearchParams,
  type MetaFunction,
} from '@remix-run/react';
import {getPaginationVariables, Pagination, parseGid} from '@shopify/hydrogen';
import {
  type ProductFilter,
  type ProductSortKeys,
} from '@shopify/hydrogen/storefront-api-types';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  IconFilter,
  IconSortAscending2,
  IconSortDescending2,
} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import type {
  GetTreatmentsQuery,
  TreatmentFragment,
} from 'storefrontapi.generated';
import {PriceBadge} from '~/components/artist/PriceBadge';
import {CityFilter} from '~/components/filters/CityFilter';
import {LocationFilter} from '~/components/filters/LocationFilter';
import {ResetFilter} from '~/components/filters/ResetFilter';
import {USER_FRAGMENT} from '~/graphql/fragments/User';
import {USER_COLLECTION_FILTER} from '~/graphql/fragments/UserCollectionFilter';
import {useFilterCounts} from '~/hooks/useFilterCounts';
import {generateQuerySearch} from '~/lib/generateQuerySearch';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {
      title: `BySisters | ${data?.rootCollection.title ?? ''}`,
    },
  ];
};

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 10,
  });

  if (!handle) {
    throw new Response(`${handle} is missing`, {
      status: 404,
    });
  }

  const {collection: rootCollection} = await storefront.query(
    GET_CATEGORY_QUERY,
    {
      variables: {
        handle,
      },
    },
  );

  if (!rootCollection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  // we are getting rootCollectionFilters to figure out the total count of the subcollections
  const {collection: rootCollectionFilters} = await storefront.query(
    GET_COLLECTION_FILTERS,
    {
      variables: {
        handle: rootCollection.handle,
        language: 'DA',
      },
      cache: storefront.CacheLong(),
    },
  );

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const sortKey: ProductSortKeys =
    (searchParams.get('sort') as ProductSortKeys) || 'CREATED_AT';
  const reverse = searchParams.get('reverse') !== 'true';

  /*const querySearch = [
    'tag:treatments',
    'tag_not:hide-from-profile',
    // missing active {productMetafield: {namespace: 'system', key: 'active', value: 'true'}},
    // missing default {productMetafield: {namespace: 'system', key: 'default', value: 'true'}},
  ];*/

  const filters: ProductFilter[] = [];

  const locationType = searchParams.getAll('locationType');
  if (locationType.length > 0) {
    locationType.map((id) => filters.push({tag: `location_type-${id}`}));
  }

  const city = searchParams.getAll('city');
  if (city.length > 0) {
    city.map((id) => filters.push({tag: `city-${id}`}));
  }

  const collection = searchParams.get('collection');

  const {collection: productsFilters} = await storefront.query(
    GET_COLLECTION_FILTERS,
    {
      variables: {
        filters,
        handle: collection || rootCollection.handle,
        language: 'DA',
      },
      cache: storefront.CacheLong(),
    },
  );

  // add either rootCollection or subcollection id to querySearch, not both.
  filters.push({tag: `collectionid-${parseGid(productsFilters?.id).id}`});
  const querySearch = generateQuerySearch(filters);

  const {products} = await storefront.query(GET_TREATMENTS_CATEGORY_QUERY, {
    variables: {
      query: querySearch,
      sortKey,
      reverse,
      ...paginationVariables,
    },
  });

  return json({
    rootCollection,
    rootCollectionFilters: rootCollectionFilters?.products.filters || [],
    products,
    productsFilters: productsFilters?.products.filters || [],
  });
}

export default function Collection() {
  const {products} = useLoaderData<typeof loader>();
  const theme = useMantineTheme();

  return (
    <Box bg={getGradient({deg: 180, from: 'pink.1', to: 'white'}, theme)}>
      <Container size="xl" py={{base: rem(80), sm: rem(100)}}>
        <Header />
        <RenderProducts products={products} />
      </Container>
    </Box>
  );
}

function Header() {
  const {rootCollection, productsFilters, rootCollectionFilters} =
    useLoaderData<typeof loader>();
  const {t} = useTranslation(['treatments', 'global']);
  const [opened, {open, close}] = useDisclosure(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const collectionCount = useFilterCounts(
    rootCollectionFilters as any,
    'collectionid',
  );
  const currentReverse = searchParams.get('reverse') === 'true';

  return (
    <>
      <Flex
        direction={{base: 'column', sm: 'row'}}
        align="center"
        justify="space-between"
        gap="lg"
        mb="xl"
      >
        <Group>
          <Avatar
            alt={rootCollection.image?.altText || 'Product Image'}
            src={rootCollection.image?.url}
            size={rem(120)}
            style={{border: '3px solid rgba(243, 175, 228, 0.7)'}}
          />
          <Flex direction="column" justify="center">
            <Title order={1} fz={{base: 'xl', sm: 'h1'}} mt="-5px">
              {rootCollection.title}
            </Title>

            <Text fz={{base: 'sm', sm: 'xl'}} c="dimmed" fw={400} lineClamp={3}>
              {rootCollection.description}
            </Text>
          </Flex>
        </Group>
      </Flex>
      <Flex
        direction={{base: 'column', sm: 'row'}}
        justify="space-between"
        align="center"
        gap="md"
      >
        <Flex flex={1}>
          {!!rootCollection.children?.references?.nodes.length && (
            <Radio.Group
              value={
                searchParams.get('collection')
                  ? searchParams.get('collection')
                  : ''
              }
              onChange={(collection: string) =>
                setSearchParams({collection}, {preventScrollReset: true})
              }
            >
              <Group gap="xs" wrap="wrap">
                <Radio
                  label={`Alle (${
                    collectionCount[parseGid(rootCollection.id).id] || 0
                  })`}
                  value=""
                />
                {rootCollection.children?.references?.nodes.map((col) => (
                  <Radio
                    key={col.id}
                    value={col.handle}
                    label={`${col.title} (${
                      collectionCount[parseGid(col.id).id] || 0
                    })`}
                  />
                ))}
              </Group>
            </Radio.Group>
          )}
        </Flex>
        <Group gap="xs" flex={0.6} align="center" justify="flex-end">
          <Select
            value={
              (searchParams.get('sort') as ProductSortKeys) || 'CREATED_AT'
            }
            data={productSortKeys.map((key) => ({
              value: key,
              label: t(`global:${key.toLowerCase()}` as any),
            }))}
            onChange={(sort: string | null) =>
              setSearchParams(
                (prevParams) => {
                  prevParams.set('sort', sort || 'CREATED_AT');
                  return prevParams;
                },
                {preventScrollReset: true},
              )
            }
            placeholder="Sortere efter"
          />
          <ActionIcon
            variant="filled"
            color="pink"
            onClick={() => {
              setSearchParams(
                (prevParams) => {
                  prevParams.set('reverse', String(!currentReverse));
                  return prevParams;
                },
                {preventScrollReset: true},
              );
            }}
          >
            {currentReverse ? <IconSortDescending2 /> : <IconSortAscending2 />}
          </ActionIcon>
          <Button
            color="pink"
            onClick={open}
            size="xs"
            rightSection={<IconFilter />}
          >
            {t('filter')}
          </Button>
        </Group>
      </Flex>
      <Drawer
        position="right"
        opened={opened}
        onClose={close}
        overlayProps={{backgroundOpacity: 0.3, blur: 2}}
      >
        <Stack gap="xl">
          <LocationFilter filters={productsFilters as any} />
          <CityFilter filters={productsFilters as any} />
          <ResetFilter />
        </Stack>
      </Drawer>
    </>
  );
}

export function RenderProducts({
  products,
}: {
  products: GetTreatmentsQuery['products'];
}) {
  const {t} = useTranslation(['global']);
  if (!products) {
    return null;
  }

  return (
    <Pagination connection={products}>
      {({nodes, isLoading, PreviousLink, NextLink}) => (
        <Stack gap="xl">
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
          <SimpleGrid cols={{base: 1, xs: 2, sm: 3, md: 4}} spacing="lg">
            {nodes.map((product) => {
              return <TreatmentCard key={product.id} product={product} />;
            })}
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
      )}
    </Pagination>
  );
}

export function TreatmentCard({product}: {product: TreatmentFragment}) {
  return (
    <Card key={product.handle} withBorder radius="md" bg="white" p="sm">
      <Flex flex="1">
        <UnstyledButton component={Link} to={`/book/${product.handle}`}>
          <Stack gap="xs">
            <Text fz={rem(20)} fw={500} lineClamp={1}>
              {product.title}
            </Text>
            <Flex
              direction="column"
              justify="flex-start"
              style={{flexGrow: 1, position: 'relative'}}
              mih="38px"
            >
              <Text c="dimmed" fz="xs" fw={400} lineClamp={3}>
                {product.description || '...'}
              </Text>
            </Flex>
            <PriceBadge
              compareAtPrice={product.variants.nodes[0].compareAtPrice}
              price={product.variants.nodes[0].price}
              fw="600"
            />
          </Stack>
        </UnstyledButton>
      </Flex>
      <Card.Section>
        <Divider my="sm" />
      </Card.Section>

      <UnstyledButton
        component={Link}
        to={`/${product.user?.reference?.username?.value || ''}`}
      >
        <Group justify="space-between">
          <Group gap="xs">
            <Avatar
              src={product.user?.reference?.image?.reference?.image?.url}
              size="sm"
            />
            <Text>{product.user?.reference?.fullname?.value}</Text>
          </Group>
        </Group>
      </UnstyledButton>
    </Card>
  );
}

export const TREATMENT_FRAGMENT = `#graphql
  ${USER_FRAGMENT}

  fragment Treatment on Product {
    id
    title
    description
    handle
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
        ...User
      }
    }
  }
` as const;

export const GET_TREATMENTS_CATEGORY_QUERY = `#graphql
  ${TREATMENT_FRAGMENT}
  query GetTreatments(
    $query: String
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $reverse: Boolean = true
    $sortKey: ProductSortKeys = PRICE
  ) @inContext(country: $country, language: $language) {
    products(
      query: $query,
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor,
      sortKey: $sortKey,
      reverse: $reverse
    ) {
      nodes {
        ...Treatment
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

export const GET_CATEGORY_QUERY = `#graphql
  query GetCategory(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        url
        altText
        width
        height
      }
      children: metafield(key: "children", namespace: "booking") {
        references(first: 20) {
          nodes {
            ... on Collection {
              id
              handle
              title
              children: metafield(key: "children", namespace: "booking") {
                references(first: 20) {
                  nodes {
                    ... on Collection {
                      id
                      handle
                      title
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

export const GET_COLLECTION_FILTERS = `#graphql
  ${USER_COLLECTION_FILTER}
  query GetCollectionFilters(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $filters: [ProductFilter!] = {}
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      products(first: 1, filters: $filters) {
        filters {
          ...UserCollectionFilter
        }
      }
    }
  }
` as const;

const productSortKeys: ProductSortKeys[] = [
  'BEST_SELLING',
  'CREATED_AT',
  'ID',
  'PRICE',
  'PRODUCT_TYPE',
  'RELEVANCE',
  'TITLE',
  'UPDATED_AT',
  'VENDOR',
];
