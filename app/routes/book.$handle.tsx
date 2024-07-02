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
import {IconArrowLeft, IconArrowRight, IconX} from '@tabler/icons-react';
import {type PropsWithChildren} from 'react';
import {useTranslation} from 'react-i18next';
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
import {CREATE_ADDRESS_MUTATION} from '~/graphql/customer-account/CustomerAddressMutations';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import {LOCATION_FRAGMENT} from '~/graphql/fragments/Location';
import {TREATMENT_OPTION_FRAGMENT} from '~/graphql/fragments/TreatmentOption';
import {USER_FRAGMENT} from '~/graphql/fragments/User';
import {useLanguage} from '~/hooks/useLanguage';
import {useScrollEffect} from '~/hooks/useScrollEffect';
import {type CustomerLocation} from '~/lib/api/model';
import {useDuration} from '~/lib/duration';

export const handle: Handle = {
  i18n: ['global', 'book'],
};

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
  await context.customerAccount.handleAuthStatus();

  const {data} = await context.customerAccount.query(CUSTOMER_DETAILS_QUERY);
  if (!data.customer?.defaultAddress) {
    await context.customerAccount.mutate(CREATE_ADDRESS_MUTATION, {
      variables: {
        address: {
          firstName: data.customer.firstName,
          lastName: data.customer.lastName,
          address1: 'Trepkasgade 25',
          city: 'Aarhus',
          zip: '8000',
          territoryCode: 'DK',
        },
        defaultAddress: true,
      },
    });
  }

  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Response('Expected handle to be defined', {status: 404});
  }

  const {product} = await storefront.query(GET_PRODUCT_WITH_OPTIONS, {
    variables: {
      productHandle: handle,
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

  /*const path = request.url.substring(
    request.url.indexOf(product.handle) + product.handle.length,
  );

  // product have no options redirect to pick-location
  const options = product.options?.references?.nodes;
  if (path === '' && !options) {
    return redirect('pick-location');
  }

  // product have only one location and its not destination move to pick more
  const locations = convertLocations(product.locations?.references?.nodes);
  if (path.includes('pick-location') && locations.length === 1) {
    const location = locations[0];
    if (location.locationType !== 'destination') {
      return redirect(`pick-more?locationId=${location._id}`);
    }
  }*/

  const {searchParams} = new URL(request.url);
  const locationId = searchParams.get('locationId') as string;
  let products: PickMoreTreatmentProductFragment[] = [];
  if (locationId) {
    const data = await context.storefront.query(PICK_MORE_PRODUCTS, {
      variables: {
        query: `tag:"locationid-${locationId}" AND tag:"scheduleid-${product.scheduleId?.reference?.handle}" AND tag:"treatments" AND tag_not:"hide-from-combine"`,
      },
      cache: context.storefront.CacheShort(),
    });

    products = data?.products.nodes.filter((p) => p.id !== product.id);
  }

  return json({product, products});
}

export default function Booking() {
  const lang = useLanguage();
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
    <>
      <Affix position={{top: 0, left: 0, right: 0}}>
        <Container size="xl">
          <Flex h={50} bg="white" justify="space-between" align="center">
            <ActionIcon
              variant="transparent"
              c="black"
              onClick={() => navigate(-1)}
            >
              {lang === 'AR' ? (
                <IconArrowRight
                  style={{width: rem(36), height: rem(36), strokeWidth: 1}}
                />
              ) : (
                <IconArrowLeft
                  style={{width: rem(36), height: rem(36), strokeWidth: 1}}
                />
              )}
            </ActionIcon>

            <Title
              order={2}
              style={{
                transition: 'all 0.3s ease',
                opacity,
              }}
            ></Title>
            <ActionIcon
              variant="transparent"
              c="black"
              component={Link}
              to={`/${product.user?.reference?.username?.value || ''}`}
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

      <Container size="md" mt={rem(62)} mb={rem(100)}>
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
    </>
  );
}

export function BookingDetails({children}: PropsWithChildren) {
  const {t} = useTranslation('book');
  const durationToTime = useDuration();
  const {
    selectedLocation,
    product,
    pickedVariants,
    summary,
    totalDuration,
    totalPrice,
  } = useOutletContext<OutletLoader>();

  return (
    <Grid.Col span={{base: 12, md: 5}} visibleFrom="md" pos="relative">
      <Card withBorder radius="md" pos="sticky" top="64px" flex="1">
        <Stack gap="md">
          {selectedLocation ? (
            <div>
              <Flex justify="center">
                <Group>
                  <Title fz="h2">{selectedLocation?.name}</Title>

                  <LocationIcon
                    location={{
                      locationType: selectedLocation.locationType,
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
            <Text>{t('total_amount')}</Text>
            <Text>{totalPrice + summary.price} kr.</Text>
          </Flex>
          <Flex justify="space-between">
            <Text>{t('total_time')}</Text>
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
              <Text fw="bold">{totalPrice + summary.price} kr.</Text>
              <Text>
                {t('total_services', {
                  count:
                    1 +
                    summary.pickedVariants.filter((f) => !f.isVariant).length,
                })}{' '}
                - {durationToTime(totalDuration + summary.duration)}
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
    $country: CountryCode
    $language: LanguageCode
    $query: String
  ) @inContext(country: $country, language: $language) {
    products(first: 20, sortKey: TITLE, query: $query) {
      nodes {
        ...PickMoreTreatmentProduct
      }
    }
  }
` as const;
