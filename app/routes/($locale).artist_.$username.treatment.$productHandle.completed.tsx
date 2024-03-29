import {
  Anchor,
  Box,
  Card,
  Divider,
  Flex,
  Group,
  Stack,
  Text,
  rem,
} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {useLoaderData} from '@remix-run/react';
import {Money, parseGid} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconClockHour3, IconGps, IconHotelService} from '@tabler/icons-react';
import {format} from 'date-fns';
import da from 'date-fns/locale/da';
import {v4 as uuidv4} from 'uuid';
import {AddToCartTreatment} from '~/components/AddToCartTreatments';
import {TreatmentArtistCardComplete} from '~/components/treatment/TreatmentArtistCardComplete';
import {PRODUCT_SELECTED_OPTIONS_QUERY} from '~/data/queries';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {durationToTime} from '~/lib/duration';
import {ALL_PRODUCTS_QUERY} from './($locale).artist.$username._index';

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

    const {payload: user} = await getBookingShopifyApi().userGet(username);

    const {payload: availability} =
      await getBookingShopifyApi().userAvailabilityGet(username, locationId, {
        productIds: joinProductIds,
        fromDate, //: '2023-11-26T05:15:00.000Z',
        toDate, //: '2023-11-26T08:05:00.000Z',
        shippingId: shippingId ? shippingId : undefined,
      });

    const {products} = await context.storefront.query(ALL_PRODUCTS_QUERY, {
      variables: {
        first: joinProductIds.length,
        query: joinProductIds.join(' OR '),
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    });

    const groupId = uuidv4();

    return json({
      location,
      user,
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
  const isMobile = useMediaQuery('(max-width: 62em)');

  const productMarkup = data.products.nodes.map((product) => {
    const slotProduct = data.availability.slot.products.find(
      (p) => p.productId.toString() === parseGid(product.id).id,
    );

    return (
      <div key={product.handle}>
        <Text size="md" fw={500}>
          {product.title}
        </Text>
        <Text size="md" c="dimmed" fw={500} lineClamp={1}>
          {product.description}
        </Text>
        <Flex align="center" gap="lg">
          <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
            {durationToTime(slotProduct?.duration ?? 0)}
          </Text>
          {slotProduct?.price && (
            <Text size="xs" c="dimmed" fw={500}>
              <Money data={slotProduct?.price as any} as="span" />
            </Text>
          )}
        </Flex>
      </div>
    );
  });

  return (
    <Box mt="lg" mb="100">
      <TreatmentArtistCardComplete artist={data.user} />
      <Card.Section pt="md" pb="md">
        <Divider />
      </Card.Section>
      <Group mb="xs" gap="xs">
        <IconGps />
        <Text size="lg" fw="bold">
          Location
        </Text>
      </Group>
      {data?.location.locationType === 'destination' ? (
        <>
          <Text size="md" fw={500}>
            {data?.availability.shipping?.destination.fullAddress}
          </Text>
          <Text size="xs" c="red" fw={500}>
            Udgifterne bliver beregnet under købsprocessen{' '}
            {data?.availability.shipping?.cost.value}{' '}
            {data?.availability.shipping?.cost.currency}
          </Text>
        </>
      ) : (
        <>
          <Text size="md" fw={500}>
            {data?.location.name}
          </Text>
          <Text size="md" fw={500}>
            {data?.location.fullAddress}
          </Text>
          <Anchor href="googlemap">Se google map</Anchor>
        </>
      )}
      <Card.Section pt="md" pb="md">
        <Divider />
      </Card.Section>

      <Group mb="xs" gap="xs">
        <IconClockHour3 />
        <Text size="lg" fw="bold">
          Tid
        </Text>
      </Group>
      {data?.availability.slot.from && (
        <Text size="md" fw={500}>
          {format(
            new Date(data?.availability.slot.from || ''),
            "EEEE',' 'd.' d'.' LLL 'kl 'HH:mm",
            {
              locale: da,
            },
          )}
        </Text>
      )}

      <Card.Section pt="md" pb="md">
        <Divider />
      </Card.Section>

      <Group mb="xs" gap="xs">
        <IconHotelService />
        <Text size="lg" fw="bold">
          Ydelser
        </Text>
      </Group>
      <Stack gap="xs">{productMarkup}</Stack>

      <Box
        pos="fixed"
        bottom="0"
        left="50%"
        w={isMobile ? '100%' : '720px'}
        p={isMobile ? 'md' : 'lg'}
        bg="white"
        style={{
          transform: 'translate(-50%, 0)',
          boxShadow: '0 -4px 4px rgba(0,0,0,.1)',
        }}
      >
        <Group justify="space-between">
          <Group gap="xs">
            <Text c="dimmed" size={rem(isMobile ? 16 : 20)}>
              4/4
            </Text>
            <Text fw={500} tt="uppercase" size={rem(isMobile ? 16 : 20)}>
              Færdig
            </Text>
          </Group>
          <AddToCartTreatment
            products={data.products}
            availability={data.availability}
            location={data.location}
            groupId={data.groupId}
          />
        </Group>
      </Box>
    </Box>
  );
}
