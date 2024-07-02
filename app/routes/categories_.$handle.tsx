import {
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
  rem,
  SimpleGrid,
  Stack,
  Text,
  Title,
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
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconFilter, IconSearch} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import type {
  GetTreatmentsQuery,
  TreatmentFragment,
} from 'storefrontapi.generated';
import {ResetFilter} from '~/components/filters/ResetFilter';
import {USER_FRAGMENT} from '~/graphql/fragments/User';

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

  if (!handle) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  const {collection} = await storefront.query(GET_CATEGORY_QUERY, {
    variables: {
      handle,
    },
  });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  const {products} = await storefront.query(GET_TREATMENTS_CATEGORY_QUERY, {
    variables: {
      query: `tag:collectionid-${parseGid(collection.id).id}`,
      ...paginationVariables,
    },
  });

  return json({collection, products});
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
  const {collection} = useLoaderData<typeof loader>();
  const {t} = useTranslation(['treatments', 'global']);
  const [opened, {open, close}] = useDisclosure(false);
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <>
      <Flex
        direction={{base: 'column', sm: 'row'}}
        align="center"
        gap="lg"
        mb="sm"
      >
        <Avatar
          alt={collection.image?.altText || 'Product Image'}
          src={collection.image?.url}
          size={rem(120)}
          style={{border: '3px solid rgba(243, 175, 228, 0.7)'}}
        />
        <Flex direction="row" gap={{base: 'sm', sm: 'lg'}} flex={1}>
          <Flex direction="column" justify="center">
            <Title order={1} fz={{base: 'xl', sm: 'h1'}} mt="-5px">
              {collection?.title}
            </Title>

            <Text fz={{base: 'sm', sm: 'xl'}} c="dimmed" fw={400} lineClamp={3}>
              {collection.description}
            </Text>
          </Flex>
        </Flex>
        <Flex
          justify={{base: 'center', xs: 'flex-end'}}
          gap="md"
          miw="40%"
          wrap="wrap"
        >
          <ResetFilter />
          <Button
            color="pink"
            onClick={open}
            size="md"
            leftSection={<IconFilter />}
          >
            {t('filter')}
          </Button>
        </Flex>
      </Flex>
      {!!collection.children?.references?.nodes.length && (
        <Flex gap="xs" wrap="wrap">
          {collection.children?.references?.nodes.map((col) => (
            <Button
              key={col.id}
              component={Link}
              to={`/categories/${col.handle}`}
              variant="outline"
              leftSection={<IconSearch />}
            >
              {col.title}
            </Button>
          ))}
        </Flex>
      )}
      <Drawer
        position="right"
        opened={opened}
        onClose={close}
        overlayProps={{backgroundOpacity: 0.3, blur: 2}}
      >
        <Stack gap="xl">asd</Stack>
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
  const {t} = useTranslation(['categories']);
  return (
    <Card
      key={product.handle}
      withBorder
      radius="md"
      component={Link}
      bg="white"
      p="0"
      to={`/treatments/${product.handle}`}
    >
      <Text fz={rem(20)} fw={500} m="sm" mb="4px" lineClamp={1}>
        {product.title}
      </Text>
      <Flex
        gap="sm"
        direction="column"
        justify="flex-start"
        style={{flexGrow: 1, position: 'relative'}}
        mih="38px"
      >
        <Text c="dimmed" fz="xs" fw={400} lineClamp={3} mx="sm">
          {product.description || '...'}
        </Text>
      </Flex>
      <Card.Section>
        <Divider mt="sm" />
      </Card.Section>

      <Group justify="space-between" m="sm">
        <Group gap="xs">
          <Avatar
            src={product.user?.reference?.image?.reference?.image?.url}
            size="sm"
          />
          <Text>{product.user?.reference?.fullname?.value}</Text>
        </Group>
      </Group>
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
  ) @inContext(country: $country, language: $language) {
    products(
      query: $query,
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor,
      sortKey: TITLE
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
