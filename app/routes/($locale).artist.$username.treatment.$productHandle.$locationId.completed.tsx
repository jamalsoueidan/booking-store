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
import {useActionData} from '@remix-run/react';
import {Money, parseGid} from '@shopify/hydrogen';
import {type CartLineInput} from '@shopify/hydrogen/storefront-api-types';
import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {format} from 'date-fns';
import da from 'date-fns/locale/da';
import {ArtistStepper} from '~/components/artist/ArtistStepper';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {durationToTime} from '~/lib/duration';
import {ALL_PRODUCTS_QUERY} from './($locale).artist.$username._index';
import {AddToCartButton} from './($locale).products.$handle';

export const action = async ({
  request,
  params,
  context,
}: ActionFunctionArgs) => {
  const {productHandle, username, locationId} = params;

  const {searchParams} = new URL(request.url);
  const shippingId = searchParams.get('shippingId');
  const productIds = searchParams.getAll('productIds');

  if (productIds.length === 0) {
    throw new Response('Expected productId to be selected', {status: 400});
  }

  if (!productHandle || !username || !locationId) {
    throw new Response('Expected product handle to be defined', {status: 400});
  }

  const formData = await request.formData();
  const fromDate = formData.get('fromDate') as string;
  const toDate = formData.get('toDate') as string;

  const {payload: location} = await getBookingShopifyApi().userLocationGet(
    username,
    locationId,
  );

  const {payload: availability} =
    await getBookingShopifyApi().userAvailabilityGet(username, locationId, {
      productIds,
      fromDate, //: '2023-11-26T05:15:00.000Z',
      toDate, //: '2023-11-26T08:05:00.000Z',
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
};

export default function ArtistTreatmentsBooking() {
  const data = useActionData<typeof action>();

  const productMarkup = data?.products.nodes.map((product) => {
    const slotProduct = data?.availability.slot.products.find(
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

  const lines: Array<CartLineInput> = (data?.products.nodes || []).map(
    (product) => {
      const slotProduct = data?.availability.slot.products.find(
        (p) => p.productId.toString() === parseGid(product.id).id,
      );

      const productVariant = product.variants.nodes.find(
        (v) => parseGid(v.id).id === slotProduct?.variantId.toString(),
      );

      const input =
        {
          merchandiseId: productVariant?.id || '',
          quantity: 1,
          attributes: [
            {
              key: '_from',
              value: slotProduct?.from || '',
            },
            {
              key: '_to',
              value: slotProduct?.to || '',
            },
            {
              key: '_customerId',
              value: data?.availability.customer.customerId?.toString() || '',
            },
            {
              key: 'Dato',
              value: `${format(
                new Date(slotProduct?.from || new Date()),
                'iiii',
                {
                  locale: da,
                },
              )}, ${format(new Date(slotProduct?.from || new Date()), 'PPP', {
                locale: da,
              }).slice(0, -4)}`,
            },
            {
              key: 'Tid',
              value: format(new Date(slotProduct?.from || new Date()), 'p', {
                locale: da,
              }),
            },
            {
              key: 'Skønhedsekspert',
              value: data?.availability.customer.fullname || '',
            },
            {
              key: 'Varighed',
              value: durationToTime(slotProduct?.duration || ''),
            },
          ],
        } || [];

      if (data?.availability.shipping) {
        input.attributes.push({
          key: '_shippingId',
          value: data?.availability.shipping?._id || '',
        });
      }

      return input;
    },
  );

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
        <AddToCartButton
          onClick={() => {
            window.location.href = window.location.href + '#cart-aside';
          }}
          lines={lines}
        >
          Add to cart
        </AddToCartButton>
      </Group>
    </ArtistStepper>
  );
}
