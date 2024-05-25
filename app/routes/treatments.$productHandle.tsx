import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@shopify/remix-oxygen';

import {Link, useLoaderData} from '@remix-run/react';
import {
  UNSTABLE_Analytics as Analytics,
  getPaginationVariables,
  parseGid,
} from '@shopify/hydrogen';

import {
  Avatar,
  Badge,
  Button,
  Card,
  Container,
  Flex,
  Group,
  Image,
  rem,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import {PriceBadge} from '~/components/artist/PriceBadge';
import {ProfessionTranslations} from './api.users.professions';

import {useMediaQuery} from '@mantine/hooks';
import {IconCalendar} from '@tabler/icons-react';
import type {
  TreatmentProductFragment,
  TreatmentsForCollectionFragment,
  UserCollectionFragment,
} from 'storefrontapi.generated';
import {LocationIcon} from '~/components/LocationIcon';
import {LOCATION_FRAGMENT} from '~/graphql/fragments/Location';
import {convertLocations} from '~/lib/convertLocations';
import {durationToTime} from '~/lib/duration';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `BySisters | ${data?.product.title ?? ''}`}];
};

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {productHandle} = params;
  const {storefront} = context;

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 10,
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
    },
  );

  if (!product) {
    throw new Response(null, {status: 404});
  }

  const {collection} = await storefront.query(TREATMENT_COLLECTION, {
    variables: {
      handle: product.collection?.reference?.handle || '',
      ...paginationVariables,
    },
  });

  return json({product, collection});
}

export default function Product() {
  const {product, collection} = useLoaderData<typeof loader>();
  const isMobile = useMediaQuery('(max-width: 62em)');

  return (
    <Container size="xl">
      <Flex direction={{base: 'column', sm: 'row'}} mt={rem(100)} gap="xl">
        <Flex
          style={{order: isMobile ? 2 : undefined}}
          flex="1"
          direction="column"
          justify="center"
        >
          <Group my="xs" justify="space-between">
            <Title order={1}>{product?.title}</Title>
          </Group>

          <Text
            size="xl"
            c="dimmed"
            fw={400}
            dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
          ></Text>
        </Flex>
        <Flex
          style={{order: isMobile ? 1 : undefined}}
          flex="1"
          justify="flex-end"
        >
          <Image
            alt={product.featuredImage?.altText || 'Product Image'}
            src={product.featuredImage?.url}
            radius="lg"
            height="auto"
            width="100%"
          />
        </Flex>
      </Flex>

      <Card
        radius="lg"
        withBorder
        bg="rgba(243, 175, 228, 0.15)"
        style={{border: '1px solid rgba(243, 175, 228, 0.25)'}}
        my={rem(50)}
      >
        <Title order={2} c="gray" fw="400">
          Alle Skønhedseksperter der tilbyder den ydelse
        </Title>
      </Card>
      <Stack gap="lg" my={rem(50)}>
        {collection?.products.nodes ? (
          collection?.products.nodes.map((product) => (
            <TreatmentProductUser key={product.id} product={product} />
          ))
        ) : (
          <Text fw="500">Ingen skønhedseksperter til den pågældende pris.</Text>
        )}
      </Stack>
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

  const variant = product.variants.nodes[0];
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

        <SimpleGrid cols={{base: 1, sm: 4}}>
          <ArtistProduct user={user} product={product} />
        </SimpleGrid>
      </Stack>
    </Card>
  );
}

export function ArtistProduct({
  user,
  product,
}: {
  user: UserCollectionFragment;
  product: TreatmentProductFragment;
}) {
  const productId = parseGid(product?.id).id;
  const locations = convertLocations(product.locations?.references?.nodes);

  return (
    <Card
      key={product.handle}
      withBorder
      component={Link}
      radius="md"
      data-testid={`service-item-${productId}`}
      to={`/artist/${user.username?.value}/treatment/${product.handle}`}
    >
      <Flex direction="column" gap="md" h="100%">
        <Stack gap="6px" style={{flex: 1}}>
          <Flex justify="space-between">
            <Title
              order={2}
              size={rem(24)}
              fw={600}
              lts=".5px"
              data-testid={`service-title-${productId}`}
            >
              {product.title}
            </Title>
            <Flex gap="4px">
              {locations.map((location, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <LocationIcon key={index} location={location} />
              ))}
            </Flex>
          </Flex>
          <Text
            c="dimmed"
            size="md"
            fw={400}
            lineClamp={3}
            dangerouslySetInnerHTML={{
              __html: product?.descriptionHtml || 'ingen beskrivelse',
            }}
          ></Text>
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
              style={{width: rem(32), height: rem(32)}}
              stroke="1"
            />
            <Text fw="bold" data-testid={`service-duration-text-${productId}`}>
              {durationToTime(product.duration?.value || 0)}
            </Text>
          </Flex>

          <PriceBadge
            compareAtPrice={product.variants.nodes[0].compareAtPrice}
            price={product.variants.nodes[0].price}
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
    descriptionHtml
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
            }
          }
        }
      }
    }
  }
` as const;

const TREATMENTS_FOR_COLLECTION = `#graphql
  ${USER_COLLECTION_FRAGMENT}
  ${LOCATION_FRAGMENT}
  fragment TreatmentsForCollection on Product {
    id
    title
    description
    handle
    vendor
    descriptionHtml
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
      references(first: 10) {
        nodes {
          ...Location
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
