import {
  AspectRatio,
  Avatar,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  Image,
  rem,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {
  UNSTABLE_Analytics as Analytics,
  getPaginationVariables,
  Pagination,
} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {
  CategoriesCollectionFilterFragment,
  CategoriesCollectionFragment,
  CategoriesCollectionProductFragment,
} from 'storefrontapi.generated';
import {Wrapper} from '~/components/Wrapper';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {
      title: `BySisters | ${data?.collection.title ?? ''}`,
    },
  ];
};

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 10,
  });

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {
      handle: handle || 'alle-behandlinger',
      ...paginationVariables,
    },
  });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  return json({collection});
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();

  return (
    <Wrapper>
      <Pagination connection={collection.products}>
        {({nodes, isLoading, PreviousLink, NextLink}) => (
          <Stack gap="xl">
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
                Hent flere ↓
              </Button>
            </Flex>
          </Stack>
        )}
      </Pagination>
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </Wrapper>
  );
}

export function TreatmentCard({
  product,
}: {
  product: CategoriesCollectionFragment;
}) {
  return (
    <Card
      key={product.handle}
      withBorder
      radius="xl"
      component={Link}
      bg="transparent"
      p="0"
      to={`/treatments/${product.handle}`}
    >
      {product.featuredImage && (
        <AspectRatio ratio={1 / 0.7}>
          <Image src={product.featuredImage.url} loading="lazy" fit="cover" />
        </AspectRatio>
      )}
      <Text size={rem(20)} fw={500} m="sm" mb="4px" lineClamp={1}>
        {product.title}
      </Text>
      <Flex
        gap="sm"
        direction="column"
        justify="flex-start"
        style={{flexGrow: 1, position: 'relative'}}
        mih="38px"
      >
        <Text c="dimmed" size="xs" fw={400} lineClamp={2} mx="sm">
          {product.description || 'ingen beskrivelse'}
        </Text>
      </Flex>
      <Card.Section>
        <Divider mt="sm" />
      </Card.Section>

      <Group justify="space-between" m="sm">
        <Users
          products={product.collection?.reference?.products.nodes || []}
          filters={product.collection?.reference?.products.filters || []}
        />
        <Button variant="default" size="xs" radius="lg">
          Se behandling
        </Button>
      </Group>
    </Card>
  );
}

function Users({
  products,
  filters,
}: {
  products: CategoriesCollectionProductFragment[];
  filters: CategoriesCollectionFilterFragment[];
}) {
  if (products.length === 0) {
    return (
      <Avatar.Group spacing="xs">
        <Avatar radius="lg" size="sm">
          +0
        </Avatar>
      </Avatar.Group>
    );
  }

  const availability = filters.find((p) => p.id === 'filter.v.availability');

  const highestCount =
    availability?.values.reduce((max, obj) => Math.max(max, obj.count), 0) || 0;

  const users = products.map((p) => p.user);

  return (
    <Avatar.Group spacing="xs">
      {users?.map((user) => (
        <Avatar
          key={user?.reference?.id}
          src={user?.reference?.image?.reference?.image?.url}
          radius="lg"
          size="sm"
        />
      ))}
      {highestCount > users.length ? (
        <Avatar radius="lg" size="sm">
          +{highestCount - users.length}
        </Avatar>
      ) : null}
    </Avatar.Group>
  );
}

export const CATEGORIES_COLLECTION_PRODUCT_USER_FRAGMENT = `#graphql
  fragment CategoriesCollectionProductUser on Metaobject {
    id
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
  }
` as const;

export const CATEGORIES_COLLECTION_PRODUCT_FRAGMENT = `#graphql
  ${CATEGORIES_COLLECTION_PRODUCT_USER_FRAGMENT}

  fragment CategoriesCollectionProduct on Product {
    id
    user: metafield(key: "user", namespace: "booking") {
      reference {
        ...CategoriesCollectionProductUser
      }
    }
  }
` as const;

export const CATEGORIES_COLLECTION_FILTERS_FRAGMENT = `#graphql
  fragment CategoriesCollectionFilter on Filter {
    id
    label
    values {
      count
    }
  }
` as const;

export const CATEGORIES_COLLECTION_FRAGMENT = `#graphql
  ${CATEGORIES_COLLECTION_PRODUCT_FRAGMENT}
  ${CATEGORIES_COLLECTION_FILTERS_FRAGMENT}

  fragment CategoriesCollection on Product {
    id
    title
    descriptionHtml
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
    collection: metafield(key: "collection", namespace: "system") {
      reference {
        ... on Collection {
          products(first: 4, sortKey: RELEVANCE, filters: [{productMetafield: {namespace: "system", key: "default", value: "true"}}, {productMetafield: {namespace: "booking", key: "hide_from_profile", value: "false"}}, {productMetafield: {namespace: "system", key: "active",value: "true"}}]) {
            filters {
              ...CategoriesCollectionFilter
            }
            nodes {
              ...CategoriesCollectionProduct
            }
          }
        }
      }
    }
  }
` as const;

const COLLECTION_QUERY = `#graphql
  ${CATEGORIES_COLLECTION_FRAGMENT}
  query categoriesCollection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        sortKey: TITLE
      ) {
        nodes {
          ...CategoriesCollection
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
