import {
  Anchor,
  Avatar,
  Card,
  Flex,
  Grid,
  Group,
  rem,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {useLoaderData, useOutletContext} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconClockHour3, IconServicemark} from '@tabler/icons-react';
import {v4 as uuidv4} from 'uuid';
import {AddToCartTreatment} from '~/components/AddToCartTreatments';
import {
  BookingDetails,
  GET_PRODUCT_WITH_OPTIONS,
  type OutletLoader,
} from './book.$handle';

import {useTranslation} from 'react-i18next';
import {LocationIcon} from '~/components/LocationIcon';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {convertToLocation} from '~/lib/convertLocations';
import {useDate, useDuration} from '~/lib/duration';
import {parseOptionsFromQuery} from '~/lib/parseOptionsQueryParameters';

export const loader = async ({
  request,
  params,
  context,
}: LoaderFunctionArgs) => {
  const {handle} = params;
  const {storefront} = context;

  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const productIds = searchParams.getAll('productIds');
  const locationId = searchParams.get('locationId');
  const shippingId = searchParams.get('shippingId');
  const fromDate = searchParams.get('fromDate');
  const toDate = searchParams.get('toDate');

  if (!handle || !locationId || !fromDate || !toDate) {
    throw new Response('Expected productId to be selected', {status: 400});
  }

  try {
    const {product} = await storefront.query(GET_PRODUCT_WITH_OPTIONS, {
      variables: {
        productHandle: handle,
      },
    });

    if (!product?.id) {
      throw new Response(null, {status: 404});
    }

    const location = product.locations?.references?.nodes.find(
      (l) => l.handle === locationId,
    );
    const username = product.user?.reference?.username?.value || '';

    if (!location || !username) {
      throw new Response('Location or username not found', {status: 404});
    }

    const {payload: availability} =
      await getBookingShopifyApi().userAvailabilityGet(username, locationId, {
        productIds: [parseGid(product.id).id, ...productIds],
        fromDate, //: '2023-11-26T05:15:00.000Z',
        toDate, //: '2023-11-26T08:05:00.000Z',
        shippingId: shippingId ? shippingId : undefined,
        optionIds: parseOptionsFromQuery(url.searchParams),
      });

    const groupId = uuidv4();

    return json({
      location: convertToLocation(location),
      availability,
      groupId,
      product,
    });
  } catch (err) {
    throw new Response('Username or product handle is wrong', {status: 404});
  }
};

export default function ArtistTreatmentsBooking() {
  const {t} = useTranslation(['book', 'global']);
  const {format} = useDate();
  const durationToTime = useDuration();
  const data = useLoaderData<typeof loader>();
  const {product, pickedVariants, summary} = useOutletContext<OutletLoader>();

  return (
    <>
      <Grid.Col span={{base: 12, md: 7}}>
        <Stack gap="lg">
          <div>
            <Text size="sm" c="dimmed">
              {t('steps', {step: 4, total: 4})}
            </Text>
            <Title order={1} fw={600} size="h2">
              {t('confirm_title')}
            </Title>
          </div>

          <Card withBorder radius="md">
            <Group wrap="nowrap" gap="xs">
              <Avatar
                src={
                  data.product.user?.reference?.image?.reference?.image?.url ||
                  ''
                }
                radius={0}
                size={64}
              />
              <div style={{flex: 1}}>
                <Text size="md" c="dimmed" fw="500">
                  {t('confirm_artist')}
                </Text>
                <Text size="xl" fw="bold">
                  {data.product.user?.reference?.fullname?.value}
                </Text>
              </div>
            </Group>
          </Card>

          <Card withBorder radius="md">
            <Stack gap="sm">
              <Group gap="xs" align="center">
                <IconClockHour3 />
                <Title order={3} fw={600} fz="xl">
                  {t('time', {ns: 'global'})}
                </Title>
              </Group>

              <Stack gap="xs">
                {data?.availability.slot.from && (
                  <Text fz="md" fw={500}>
                    {format(
                      new Date(data?.availability.slot.from || ''),
                      "EEEE',' 'd.' d'.' LLL 'kl 'HH:mm",
                    )}
                  </Text>
                )}
              </Stack>
            </Stack>
          </Card>

          <Card withBorder radius="md">
            <Stack gap="sm">
              <Group gap="xs" align="center">
                <LocationIcon
                  location={{
                    locationType: data.location?.locationType,
                  }}
                />
                <Title order={3} fw={600} fz="xl">
                  {t('location', {ns: 'global'})}
                </Title>
              </Group>

              <Stack gap="0">
                {data?.location?.locationType === 'destination' ? (
                  <>
                    <Text fz="md" fw={500}>
                      {data?.availability.shipping?.destination.fullAddress}
                    </Text>
                    <Text fz="xs" c="red" fw={500}>
                      {t('complete_shipping_calculation')}{' '}
                      {data?.availability.shipping?.cost.value}{' '}
                      {data?.availability.shipping?.cost.currency}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text fz="md" fw={500}>
                      {data?.location.name}
                    </Text>
                    <Text fz="md" fw={500}>
                      {data?.location.fullAddress}
                    </Text>
                    <Anchor href="googlemap">{t('complete_map')}</Anchor>
                  </>
                )}
              </Stack>
            </Stack>
          </Card>

          <Card withBorder radius="md" hiddenFrom="md" mb={rem(70)}>
            <Stack gap="sm">
              <Group gap="xs" align="center">
                <IconServicemark />
                <Title order={3} fw={600} fz="xl">
                  {t('treatments')}
                </Title>
              </Group>
              <Flex justify="space-between">
                <div>
                  <Title order={4} fw="600">
                    {product.title}
                  </Title>
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
            </Stack>
          </Card>
        </Stack>
      </Grid.Col>
      <BookingDetails>
        <div id="payment">
          <AddToCartTreatment
            availability={data.availability}
            location={data.location}
            groupId={data.groupId}
            redirectTo="cart"
          />
        </div>
      </BookingDetails>
    </>
  );
}

export const CART_PRODUCTS = `#graphql
  fragment CartProducts on Product {
    id
    title
    description
    variants(first: 1) {
      nodes {
        id
        title
        compareAtPrice {
          amount
          currencyCode
        }
        price {
          amount
          currencyCode
        }
        duration: metafield(key: "duration", namespace: "booking") {
          id
          value
        }
      }
    }
    type: metafield(key: "type", namespace: "system") {
      value
    }
    required: metafield(key: "required", namespace: "system") {
      value
    }
    duration: metafield(key: "duration", namespace: "booking") {
      id
      value
    }
  }
` as const;

export const GET_TREATMENT_PRODUCTS_IN_CART = `#graphql
  ${CART_PRODUCTS}
  query getTreatmentProductsInCart(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $query: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, query: $query, sortKey: TITLE) {
      nodes {
        ...CartProducts
      }
    }
  }
` as const;
