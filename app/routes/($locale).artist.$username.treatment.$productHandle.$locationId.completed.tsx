import {
  Anchor,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import {useActionData, useLoaderData} from '@remix-run/react';
import {Money, parseGid} from '@shopify/hydrogen';
import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {format} from 'date-fns';
import da from 'date-fns/locale/da';
import {type ArtistServicesProductsQuery} from 'storefrontapi.generated';
import {ArtistStepper} from '~/components/artist/ArtistStepper';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type CustomerProductBase} from '~/lib/api/model';
import {durationToTime} from '~/lib/duration';
import {ALL_PRODUCTS_QUERY} from './($locale).artist.$username._index';

type ActionResult = {
  date: string;
  slot: string;
  products: ArtistServicesProductsQuery['products'];
  services: CustomerProductBase[];
};

export async function loader({context, params, request}: ActionFunctionArgs) {
  const {productHandle, username, locationId} = params;

  const {searchParams} = new URL(request.url);
  const shippingId = searchParams.get('shippingId');
  const productIds = searchParams.getAll('productIds');

  if (productIds.length === 0) {
    throw new Error('Expected productId to be selected');
  }

  if (!productHandle || !username || !locationId) {
    throw new Error('Expected product handle to be defined');
  }

  /*const formData = await request.formData();
  const day = formData.get('day') as string;
  const slot = formData.get('slot') as string;*/

  const {payload: location} = await getBookingShopifyApi().userLocationGet(
    username,
    locationId,
  );

  const {payload: availability} =
    await getBookingShopifyApi().userAvailabilityGet(username, locationId, {
      productIds,
      fromDate: '2023-11-26T05:15:00.000Z',
      toDate: '2023-11-26T08:05:00.000Z',
      shippingId: shippingId ? shippingId : undefined,
    });

  const {products} = await context.storefront.query(ALL_PRODUCTS_QUERY, {
    variables: {
      first: productIds.length,
      query: productIds.length > 0 ? productIds.join(' OR ') : 'id=-',
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  return json({
    location,
    products,
    availability,
  });
}

export default function ArtistTreatmentsBooking() {
  const action = useActionData<ActionResult>();
  const {availability, location, products} = useLoaderData<typeof loader>();

  const productMarkup = products.nodes.map((product) => {
    const slotProduct = availability.slot.products.find(
      (p) => p.productId.toString() === parseGid(product.id).id,
    );

    const productVariant = product.variants.nodes.find(
      (v) => parseGid(v.id).id === slotProduct?.variantId.toString(),
    );

    return (
      <div key={product.handle}>
        <Text size="md" fw={500}>
          {product.title}
        </Text>
        <Text size="md" c="dimmed" fw={500}>
          {product.description}
        </Text>
        <Flex align="center" gap="lg">
          <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
            {durationToTime(slotProduct?.duration ?? 0)}
          </Text>
          <Text size="xs" c="dimmed" fw={500}>
            <Money data={productVariant!.price} />
          </Text>
        </Flex>
      </div>
    );
  });

  return (
    <ArtistStepper
      active={3}
      title="Færdig"
      description="Køb processen er færdig."
    >
      <Card shadow="sm" p="lg" mt="xl" radius="md" withBorder>
        <Text size="lg" mb="md" fw="bold">
          Lokation
        </Text>
        {location.locationType === 'destination' ? (
          <>
            <Text size="md" fw={500}>
              {availability.shipping?.destination.fullAddress}
            </Text>
            <Text size="xs" c="red" fw={500}>
              Udgifterne bliver beregnet under købsprocessen{' '}
              {availability.shipping?.cost.value}{' '}
              {availability.shipping?.cost.currency}
            </Text>
          </>
        ) : (
          <>
            <Text size="md" fw={500}>
              {location.name}
            </Text>
            <Text size="md" fw={500}>
              {location.fullAddress}
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
        <Text size="md" fw={500}>
          {format(new Date(availability.date), 'PPPP', {locale: da})}{' '}
        </Text>
        <Text size="md" fw={500}>
          kl. {format(new Date(availability.slot.from), 'HH:mm', {locale: da})}
        </Text>
        <Card.Section pt="md" pb="md">
          <Divider />
        </Card.Section>
        <Text size="lg" mb="md" fw="bold">
          Ydelser
        </Text>
        <Stack gap="xs">{productMarkup}</Stack>
      </Card>
      <Group m="xl" justify="center">
        <Button>Tilbage</Button>
        <Button type="submit">Køb nu</Button>
      </Group>
    </ArtistStepper>
  );
}
