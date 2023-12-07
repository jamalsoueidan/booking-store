import {Anchor, Card, Divider, Flex, Group, Stack, Text} from '@mantine/core';
import {useLoaderData} from '@remix-run/react';
import {Money, parseGid} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {format} from 'date-fns';
import da from 'date-fns/locale/da';
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

    return json({
      location,
      user,
      products,
      availability,
    });
  } catch (err) {
    throw new Response('Username or product handle is wrong', {status: 404});
  }
};

export default function ArtistTreatmentsBooking() {
  const data = useLoaderData<typeof loader>();

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
              <Money data={slotProduct?.price as any} />
            </Text>
          )}
        </Flex>
      </div>
    );
  });

  return (
    <>
      <Card shadow="sm" p="lg" mt="xl" radius="md" withBorder>
        <Text size="lg" mb="md" fw="bold">
          Skønhedsekspert
        </Text>
        <TreatmentArtistCardComplete artist={data.user} />
        <Card.Section pt="md" pb="md">
          <Divider />
        </Card.Section>
        <Text size="lg" mb="md" fw="bold">
          Lokation
        </Text>
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
        <Text size="lg" mb="md" fw="bold">
          Dato & Tid
        </Text>
        {data && (
          <>
            <Text size="md" fw={500}>
              {format(new Date(data?.availability.date || ''), 'PPPP', {
                locale: da,
              })}{' '}
            </Text>
            <Text size="md" fw={500}>
              kl.{' '}
              {format(new Date(data?.availability.slot.from || ''), 'HH:mm', {
                locale: da,
              })}
            </Text>
          </>
        )}
        <Card.Section pt="md" pb="md">
          <Divider />
        </Card.Section>
        <Text size="lg" mb="md" fw="bold">
          Ydelser
        </Text>
        <Stack gap="xs">{productMarkup}</Stack>
      </Card>
      <Group m="xl" justify="center">
        <AddToCartTreatment
          products={data.products}
          availability={data.availability}
        />
      </Group>
    </>
  );
}
