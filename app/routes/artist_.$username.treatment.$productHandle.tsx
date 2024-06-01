import {
  ActionIcon,
  Affix,
  Box,
  Card,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  rem,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  Link,
  Outlet,
  useLoaderData,
  useNavigate,
  useOutletContext,
  type ShouldRevalidateFunctionArgs,
} from '@remix-run/react';
import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
  type SerializeFrom,
} from '@shopify/remix-oxygen';
import {IconArrowLeft, IconX} from '@tabler/icons-react';
import {type PropsWithChildren} from 'react';
import type {
  PickMoreTreatmentProductFragment,
  TreatmentOptionVariantFragment,
} from 'storefrontapi.generated';
import {LocationIcon} from '~/components/LocationIcon';
import {
  redirectToOptions,
  useCalculateDurationAndPrice,
  useCalculationForExtraProducts,
} from '~/components/OptionSelector';
import {LOCATION_FRAGMENT} from '~/graphql/fragments/Location';
import {TREATMENT_OPTION_FRAGMENT} from '~/graphql/fragments/TreatmentOption';
import {USER_FRAGMENT} from '~/graphql/fragments/User';
import {useDynamicWidth} from '~/hooks/useDynamicWidth';
import {useScrollEffect} from '~/hooks/useScrollEffect';
import {type CustomerLocation} from '~/lib/api/model';
import {durationToTime} from '~/lib/duration';

export function shouldRevalidate({
  currentUrl,
  nextUrl,
}: ShouldRevalidateFunctionArgs) {
  const currentSearchParams = currentUrl.searchParams;
  const nextSearchParams = nextUrl.searchParams;

  const currentParamsCopy = new URLSearchParams(currentSearchParams);
  const nextParamsCopy = new URLSearchParams(nextSearchParams);

  return (
    currentParamsCopy.get('locationId') !== nextParamsCopy.get('locationId')
  );
}

export type OutletLoader = SerializeFrom<typeof loader> & {
  selectedLocation: CustomerLocation;
  pickedVariants: TreatmentOptionVariantFragment[];
  summary: {
    pickedVariants: Array<
      Pick<
        TreatmentOptionVariantFragment,
        'title' | 'price' | 'compareAtPrice' | 'duration'
      > & {isVariant: boolean}
    >;
    price: number;
    duration: number;
  };
  totalDuration: number;
  totalPrice: number;
  products: PickMoreTreatmentProductFragment[];
};

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `BySisters | ${data?.product.title ?? ''}`}];
};

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {username, productHandle} = params;
  const {storefront} = context;

  if (!productHandle || !username) {
    throw new Response('Expected product handle to be defined', {status: 404});
  }

  const {product} = await storefront.query(GET_PRODUCT_WITH_OPTIONS, {
    variables: {
      productHandle,
    },
  });

  if (!product) {
    throw new Response('Product handle is wrong', {
      status: 404,
    });
  }

  if (product?.options?.references?.nodes) {
    redirectToOptions({
      productOptions: product?.options?.references?.nodes,
      productLocations: product?.locations?.references?.nodes,
      request,
    });
  }

  const {searchParams} = new URL(request.url);
  const locationId = searchParams.get('locationId') as string;
  let products: PickMoreTreatmentProductFragment[] = [];
  if (locationId) {
    const {collection} = await context.storefront.query(PICK_MORE_PRODUCTS, {
      variables: {
        handle: username,
        filters: [
          {tag: 'treatments'},
          {tag: `locationid-${locationId}`},
          {tag: `scheduleid-${product.scheduleId?.reference?.handle}`},
          {
            productMetafield: {
              namespace: 'booking',
              key: 'hide_from_combine',
              value: 'False',
            },
          },
        ],
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
      cache: context.storefront.CacheShort(),
    });

    if (!collection?.products) {
      throw new Response('Collection graphql is wrong', {
        status: 404,
      });
    }

    products = collection.products.nodes.filter((p) => p.id !== product.id);
  }

  return json({product, products});
}

export default function Booking() {
  const {product, products} = useLoaderData<typeof loader>();
  const {opacity, shadow} = useScrollEffect();
  const navigate = useNavigate();

  const productOptions = product.options?.references?.nodes;
  const user = product.user?.reference;

  const {pickedVariants, totalDuration, totalPrice} =
    useCalculateDurationAndPrice({
      parentId: product.id,
      productOptions,
      currentPrice: parseInt(product.variants.nodes[0]?.price.amount || '0'),
      currentDuration: parseInt(product.duration?.value || '0'),
    });

  const {selectedLocation, ...summary} = useCalculationForExtraProducts({
    product,
    products,
  });

  return (
    <div>
      <Affix position={{top: 0, left: 0, right: 0}}>
        <Container size="xl">
          <Flex h={50} bg="white" justify="space-between" align="center">
            <ActionIcon
              variant="transparent"
              c="black"
              onClick={() => navigate(-1)}
            >
              <IconArrowLeft
                style={{width: rem(36), height: rem(36), strokeWidth: 1}}
              />
            </ActionIcon>

            <Title
              order={2}
              style={{
                transition: 'all 0.3s ease',
                opacity,
              }}
            >
              Vælg tjenester
            </Title>
            <ActionIcon
              variant="transparent"
              c="black"
              component={Link}
              to="./../../"
            >
              <IconX
                style={{width: rem(36), height: rem(36), strokeWidth: 1}}
              />
            </ActionIcon>
          </Flex>
        </Container>
        <Divider
          style={{
            transition: 'all 0.3s ease',
            opacity,
            boxShadow: shadow,
          }}
        />
      </Affix>

      <Container size="md" my={rem(62)}>
        <Grid gutter="xl">
          <Outlet
            context={{
              pickedVariants,
              product,
              user,
              products,
              selectedLocation,
              totalDuration,
              summary,
              totalPrice,
            }}
          />
        </Grid>
      </Container>
    </div>
  );
}

export function BookingDetails({children}: PropsWithChildren) {
  const {ref, width} = useDynamicWidth();
  const {
    selectedLocation,
    product,
    pickedVariants,
    summary,
    totalDuration,
    totalPrice,
  } = useOutletContext<OutletLoader>();

  return (
    <Grid.Col span={{base: 12, md: 5}} ref={ref} visibleFrom="md">
      <Card withBorder radius="md" pos="fixed" top="80" flex="1" w={width}>
        <Stack gap="md">
          {selectedLocation ? (
            <div>
              <Flex justify="center">
                <Group>
                  <Title fz="h2">{selectedLocation?.name}</Title>

                  <LocationIcon
                    location={{
                      locationType: selectedLocation.locationType,
                      originType: selectedLocation.originType,
                    }}
                  />
                </Group>
              </Flex>

              <Text size="md" ta="center">
                {selectedLocation?.fullAddress}
              </Text>
              <Card.Section>
                <Divider my="lg" />
              </Card.Section>
            </div>
          ) : null}
          <Flex justify="space-between">
            <div>
              <Title fz="lg">{product.title}</Title>
              <Text>{durationToTime(product.duration?.value || 0)}</Text>
            </div>
            <Text>{product.variants.nodes[0].price.amount} kr.</Text>
          </Flex>
          {pickedVariants?.map((variant) => (
            <Flex justify="space-between" key={variant.title}>
              <div>
                <Title order={4} fw="600">
                  {product.title} - {variant.title}
                </Title>
                <Text>{durationToTime(variant.duration?.value || 0)}</Text>
              </div>
              <Text>{variant.price.amount} kr.</Text>
            </Flex>
          ))}
          {summary.pickedVariants?.map((variant) => (
            <Flex justify="space-between" key={variant.title}>
              <div>
                <Title order={4} fw="600">
                  {variant.title}
                </Title>
                <Text>{durationToTime(variant.duration?.value || 0)}</Text>
              </div>
              <Text>{variant.price.amount} kr.</Text>
            </Flex>
          ))}
          <Divider />
          <Flex justify="space-between">
            <Text>I alt</Text>
            <Text>{totalPrice + summary.price} kr.</Text>
          </Flex>
          <Flex justify="space-between">
            <Text>Varighed</Text>
            <Text>{durationToTime(totalDuration + summary.duration)}</Text>
          </Flex>
          {children}
        </Stack>
      </Card>
      <Affix w="100%" bg="white" hiddenFrom="sm">
        <Divider size="xs" />
        <Box p="md">
          <Flex justify="space-between">
            <Flex direction="column">
              <Text fw="bold">{totalPrice} kr.</Text>
              <Text>
                {1 + summary.pickedVariants.filter((f) => !f.isVariant).length}{' '}
                ydelse - {durationToTime(summary.duration || 0)}
              </Text>
            </Flex>
            {children}
          </Flex>
        </Box>
      </Affix>
    </Grid.Col>
  );
}

export const TREATMENT_PRODUCT_WITH_OPTIONS_FRAGMENT = `#graphql
  ${TREATMENT_OPTION_FRAGMENT}
  ${USER_FRAGMENT}
  ${LOCATION_FRAGMENT}

  fragment TreatmentProductWithOptions on Product {
    id
    title
    description
    descriptionHtml
    productType
    handle
    featuredImage {
      id
      altText
      url(transform: { maxHeight: 250, maxWidth: 250, crop: CENTER })
      width
      height
    }
    variants(first: 1) {
      nodes {
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
    parentId: metafield(key: "parentId", namespace: "booking") {
      id
      value
    }
    options: metafield(key: "options", namespace: "booking") {
      references(first: 10) {
        nodes {
          ...TreatmentOption
        }
      }
    }
    user: metafield(key: "user", namespace: "booking") {
      reference {
        ...User
      }
    }
    scheduleId: metafield(key: "scheduleId", namespace: "booking") {
      reference {
        ... on Metaobject {
          handle
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
  }
` as const;

export const GET_PRODUCT_WITH_OPTIONS = `#graphql
  ${TREATMENT_PRODUCT_WITH_OPTIONS_FRAGMENT}
  query ArtistOptions(
    $productHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $productHandle) {
      ...TreatmentProductWithOptions
    }
  }
` as const;

export const PICK_MORE_TREATMENT_PRODUCT = `#graphql
  ${TREATMENT_OPTION_FRAGMENT}
  fragment PickMoreTreatmentProduct on Product {
    id
    title
    descriptionHtml
    productType
    handle
    featuredImage {
      id
      altText
      url(transform: { maxHeight: 250, maxWidth: 250, crop: CENTER })
      width
      height
    }
    variants(first: 1) {
      nodes {
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
    options: metafield(key: "options", namespace: "booking") {
      value
      references(first: 10) {
        nodes {
          ...TreatmentOption
        }
      }
    }
    duration: metafield(key: "duration", namespace: "booking") {
      id
      value
    }
  }
` as const;

export const PICK_MORE_PRODUCTS = `#graphql
  ${PICK_MORE_TREATMENT_PRODUCT}

  query PickMoreProducts(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $filters: [ProductFilter!] = {}
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(first: 20, sortKey: TITLE, filters: $filters) {
        nodes {
          ...PickMoreTreatmentProduct
        }
      }
    }
  }
` as const;
