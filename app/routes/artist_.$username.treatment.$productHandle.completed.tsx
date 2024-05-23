import {Anchor, Card, Divider, Flex, Group, Stack, Text} from '@mantine/core';
import {useLoaderData, useOutletContext} from '@remix-run/react';
import {Money, parseGid} from '@shopify/hydrogen';
import {
  json,
  type LoaderFunctionArgs,
  type SerializeFrom,
} from '@shopify/remix-oxygen';
import {IconClockHour3, IconGps, IconHotelService} from '@tabler/icons-react';
import {format} from 'date-fns';
import da from 'date-fns/locale/da';
import {v4 as uuidv4} from 'uuid';
import {AddToCartTreatment} from '~/components/AddToCartTreatments';
import {ArtistShell} from '~/components/ArtistShell';
import {TreatmentArtistCardComplete} from '~/components/treatment/TreatmentArtistCardComplete';
import {PRODUCT_SELECTED_OPTIONS_QUERY} from '~/data/queries';
import type {loader as rootLoader} from './artist_.$username.treatment.$productHandle';

import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {durationToTime} from '~/lib/duration';
import {parseOptionsFromQuery} from '~/lib/parseOptionsQueryParameters';

export const loader = async ({
  request,
  params,
  context,
}: LoaderFunctionArgs) => {
  const {productHandle, username} = params;
  const {storefront} = context;

  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const productIds = searchParams.getAll('productIds');
  const locationId = searchParams.get('locationId');
  const shippingId = searchParams.get('shippingId');
  const fromDate = searchParams.get('fromDate');
  const toDate = searchParams.get('toDate');

  if (!productHandle || !username || !locationId || !fromDate || !toDate) {
    throw new Response('Expected productId to be selected', {status: 400});
  }

  try {
    const {product} = await storefront.query(PRODUCT_SELECTED_OPTIONS_QUERY, {
      variables: {productHandle, selectedOptions: []},
    });

    if (!product?.id) {
      throw new Response(null, {status: 404});
    }

    const joinProductIds = productIds.concat(parseGid(product.id).id);

    const {payload: location} = await getBookingShopifyApi().userLocationGet(
      username,
      locationId,
    );

    const {payload: availability} =
      await getBookingShopifyApi().userAvailabilityGet(username, locationId, {
        productIds: joinProductIds,
        fromDate, //: '2023-11-26T05:15:00.000Z',
        toDate, //: '2023-11-26T08:05:00.000Z',
        shippingId: shippingId ? shippingId : undefined,
        optionIds: parseOptionsFromQuery(url.searchParams),
      });

    const availabilityProducts = availability.slot.products.map(
      (p) => p.productId,
    );

    const {products} = await context.storefront.query(
      GET_TREATMENT_PRODUCTS_IN_CART,
      {
        variables: {
          first: availabilityProducts.length,
          query: `id:${availabilityProducts.join(' OR id:')}`,
          country: context.storefront.i18n.country,
          language: context.storefront.i18n.language,
        },
      },
    );

    const groupId = uuidv4();

    return json({
      location,
      products,
      availability,
      groupId,
    });
  } catch (err) {
    throw new Response('Username or product handle is wrong', {status: 404});
  }
};

export default function ArtistTreatmentsBooking() {
  const data = useLoaderData<typeof loader>();
  const {user} = useOutletContext<SerializeFrom<typeof rootLoader>>();

  const productMarkup = data.products.nodes.map((product) => {
    const pickedVariant = product.variants.nodes[0];

    return (
      <div key={product.id}>
        <Text fz="md" fw={500}>
          {product.title}
        </Text>
        <Text fz="md" c="dimmed" fw={500} lineClamp={1}>
          {product.description}
        </Text>
        <Flex align="center" gap="lg">
          <Text fz="xs" c="dimmed" tt="uppercase" fw={500}>
            {durationToTime(
              product.duration?.value || pickedVariant.duration?.value || 0,
            )}
          </Text>
          <Text fz="xs" c="dimmed" fw={500}>
            <Money data={pickedVariant.price} as="span" />
          </Text>
        </Flex>
      </div>
    );
  });

  return (
    <>
      <ArtistShell.Main>
        <TreatmentArtistCardComplete user={user} />

        <Card.Section py="md">
          <Divider />
        </Card.Section>

        <Group mb="xs" gap="xs">
          <IconGps />
          <Text fz="lg" fw="bold">
            Location
          </Text>
        </Group>
        {data?.location.locationType === 'destination' ? (
          <>
            <Text fz="md" fw={500}>
              {data?.availability.shipping?.destination.fullAddress}
            </Text>
            <Text fz="xs" c="red" fw={500}>
              Udgifterne bliver beregnet under købsprocessen{' '}
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
            <Anchor href="googlemap">Se google map</Anchor>
          </>
        )}

        <Card.Section py="md">
          <Divider />
        </Card.Section>

        <Group mb="xs" gap="xs">
          <IconClockHour3 />
          <Text fz="lg" fw="bold">
            Tid
          </Text>
        </Group>
        {data?.availability.slot.from && (
          <Text fz="md" fw={500}>
            {format(
              new Date(data?.availability.slot.from || ''),
              "EEEE',' 'd.' d'.' LLL 'kl 'HH:mm",
              {
                locale: da,
              },
            )}
          </Text>
        )}

        <Card.Section py="md">
          <Divider />
        </Card.Section>

        <Group mb="xs" gap="xs">
          <IconHotelService />
          <Text fz="lg" fw="bold">
            Ydelser
          </Text>
        </Group>
        <Stack gap="xs">{productMarkup}</Stack>
      </ArtistShell.Main>
      <ArtistShell.Footer>
        <AddToCartTreatment
          products={data.products.nodes}
          availability={data.availability}
          location={data.location}
          groupId={data.groupId}
          redirectTo="cart"
        />
      </ArtistShell.Footer>
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
    products(first: $first, query: $query) {
      nodes {
        ...CartProducts
      }
    }
  }
` as const;
