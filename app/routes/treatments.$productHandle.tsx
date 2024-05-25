import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@shopify/remix-oxygen';

import {Link, useLoaderData} from '@remix-run/react';
import {
  UNSTABLE_Analytics as Analytics,
  getPaginationVariables,
  Pagination,
  parseGid,
} from '@shopify/hydrogen';

import {
  Avatar,
  Badge,
  Button,
  Card,
  type CardProps,
  Container,
  Flex,
  Group,
  rem,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import {PriceBadge} from '~/components/artist/PriceBadge';
import {ProfessionTranslations} from './api.users.professions';

import {IconCalendar} from '@tabler/icons-react';
import type {
  TreatmentsForCollectionFragment,
  UserCollectionFragment,
} from 'storefrontapi.generated';
import {LocationIcon} from '~/components/LocationIcon';
import type {
  CustomerLocationBaseLocationType,
  CustomerLocationBaseOriginType,
} from '~/lib/api/model';
import {durationToTime} from '~/lib/duration';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `BySisters | ${data?.product.title ?? ''}`}];
};

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {productHandle} = params;
  const {storefront} = context;

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 5,
  });

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

  const {collection} = await storefront.query(TREATMENT_COLLECTION, {
    variables: {
      handle: product.collection.reference.handle,
      ...paginationVariables,
    },
    cache: storefront.CacheShort(),
  });

  if (!collection) {
    throw new Response(
      `Collection ${product.collection?.reference?.handle} not found`,
      {
        status: 404,
      },
    );
  }

  return json({product, collection});
}

export default function Product() {
  const {product, collection} = useLoaderData<typeof loader>();

  const tags = collection?.products.filters.find(
    (p) => p.id === 'filter.p.tag',
  );
  const availability = collection?.products.filters
    .find((k) => k.id === 'filter.v.availability')
    ?.values.find((p) => (p.input as any)?.includes('true'));

  const cityCount = tags?.values
    .filter((p) => p.label.includes('city'))
    .reduce((total, city) => {
      return total + city.count;
    }, 0);

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
        radius="lg"
        withBorder
        bg="rgba(243, 175, 228, 0.15)"
        style={{border: '1px solid rgba(243, 175, 228, 0.25)'}}
        mt={rem(50)}
      >
        <Flex gap="xl">
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
      </Card>

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
            <Flex direction="column" gap="lg">
              {nodes.map((product) => {
                return (
                  <TreatmentProductUser key={product.id} product={product} />
                );
              })}
            </Flex>
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

  const professions =
    (JSON.parse(user.professions?.value || '[]') as Array<string>) || [];

  return (
    <Card withBorder p="xl" radius="lg">
      <Stack gap="xl">
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
              <Flex gap="xs" mt={rem(8)}>
                {professions.map((p) => (
                  <Badge key={p} color="pink.4">
                    {ProfessionTranslations[p]}
                  </Badge>
                ))}
              </Flex>
            </Stack>
          </Flex>
          <div>
            <Button
              variant="outline"
              c="black"
              color="gray.3"
              radius="lg"
              component={Link}
              to={`/artist/${user.username?.value}`}
            >
              Vis profil
            </Button>
          </div>
        </Flex>

        <SimpleGrid cols={{base: 1, sm: 2, md: 3}} spacing="xl">
          <ArtistProduct
            user={user}
            product={product}
            bg="rgba(243, 175, 228, 0.1)"
          />
          {product.user?.reference?.collection?.reference?.products.nodes
            .filter((p) => p.id !== product.id)
            .map((p) => (
              <ArtistProduct key={p.id} user={user} product={p} />
            ))}
        </SimpleGrid>
      </Stack>
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
} & CardProps) {
  const productId = parseGid(product?.id).id;
  const locations = product.locations?.references?.nodes.map((p) => ({
    locationType: p.locationType?.value as CustomerLocationBaseLocationType,
    originType: p.originType?.value as CustomerLocationBaseOriginType,
  }));

  return (
    <Card
      key={product.handle}
      withBorder
      component={Link}
      radius="md"
      p="md"
      data-testid={`service-item-${productId}`}
      to={`/artist/${user.username?.value}/treatment/${product.handle}`}
      {...props}
    >
      <Flex direction="column" gap="md" h="100%">
        <Stack gap="sm" style={{flex: 1}}>
          <Flex justify="space-between">
            <Title
              order={2}
              size={rem(20)}
              fw={600}
              lts=".5px"
              data-testid={`service-title-${productId}`}
              lineClamp={1}
            >
              {product.title}
            </Title>
            <Flex gap="4px">
              {locations?.map((location, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <LocationIcon key={index} location={location} />
              ))}
            </Flex>
          </Flex>
          <Text c="dimmed" size="sm" fw={400} lineClamp={3}>
            {product.description}
          </Text>
        </Stack>

        <Group
          justify="space-between"
          bg="gray.1"
          w="100%"
          px="md"
          py="sm"
          style={{borderRadius: '25px'}}
        >
          <Flex gap="4px" align="center">
            <IconCalendar
              style={{width: rem(18), height: rem(18)}}
              stroke="1"
            />
            <Text
              fw="bold"
              fz="xs"
              data-testid={`service-duration-text-${productId}`}
            >
              {durationToTime(product.duration?.value || 0)}
            </Text>
          </Flex>

          <PriceBadge
            compareAtPrice={product.variants.nodes[0].compareAtPrice}
            price={product.variants.nodes[0].price}
            size="sm"
            py={rem(10)}
          />
        </Group>
      </Flex>
    </Card>
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
            url(transform: {})
          }
        }
      }
    }
    collection: field(key: "collection") {
      reference {
        ... on Collection {
          id
          products(first: 3, sortKey: BEST_SELLING) {
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
                      originType: field(key: "origin_type") {
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
            originType: field(key: "origin_type") {
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
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        filters: [{productMetafield: {namespace: "booking", key: "hide_from_profile", value: "false"}}, {productMetafield: {namespace: "system", key: "active",value: "true"}}]
      ) {
        filters {
          id
          label
          values {
            input
            label
            count
          }
        }
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
