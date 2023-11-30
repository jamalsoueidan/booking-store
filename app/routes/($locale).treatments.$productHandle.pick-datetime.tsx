import {Carousel} from '@mantine/carousel';
import {Button, SimpleGrid, Stack, Text, Title} from '@mantine/core';

import {
  useLoaderData,
  useSearchParams,
  type ShouldRevalidateFunctionArgs,
} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {format} from 'date-fns';
import {da} from 'date-fns/locale';
import {MultilineButton} from '~/components/MultilineButton';
import {PRODUCT_SELECTED_OPTIONS_QUERY} from '~/data/queries';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {
  type UserAvailability,
  type UserAvailabilitySlot,
} from '~/lib/api/model';

export function shouldRevalidate({
  currentUrl,
  nextUrl,
}: ShouldRevalidateFunctionArgs) {
  const currentSearchParams = currentUrl.searchParams;
  const nextSearchParams = nextUrl.searchParams;

  const currentParamsCopy = new URLSearchParams(currentSearchParams);
  const nextParamsCopy = new URLSearchParams(nextSearchParams);

  currentParamsCopy.delete('date');
  currentParamsCopy.delete('fromDate');
  currentParamsCopy.delete('toDate');
  nextParamsCopy.delete('date');
  nextParamsCopy.delete('fromDate');
  nextParamsCopy.delete('toDate');

  return currentParamsCopy.toString() !== nextParamsCopy.toString();
}

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {productHandle} = params;
  const {storefront} = context;
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const username = searchParams.get('username');
  const productIds = url.searchParams.getAll('productIds');
  const locationId = url.searchParams.get('locationId') as string | undefined;
  const shippingId = url.searchParams.get('shippingId') as string | undefined;

  if (!username || !productHandle || !locationId) {
    throw new Response('Expected artist handle to be defined', {status: 400});
  }

  const {product} = await storefront.query(PRODUCT_SELECTED_OPTIONS_QUERY, {
    variables: {productHandle, selectedOptions: []},
  });

  if (!product?.id) {
    throw new Response('Expected product handle to be defined', {status: 404});
  }

  const availability = await getBookingShopifyApi().userAvailabilityGenerate(
    username,
    locationId,
    {
      productIds: [parseGid(product.id).id, ...productIds],
      fromDate: '2023-05-13',
      shippingId: shippingId ? shippingId : undefined, //stringify ignore undefined values but not NULL
    },
  );

  return json(availability);
}

export default function ArtistTreatmentsBooking() {
  const availability = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const onChangeDate = (availability: UserAvailability) => () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('date', availability.date);
    newSearchParams.delete('fromDate');
    newSearchParams.delete('toDate');
    setSearchParams(newSearchParams);
  };

  const onChangeSlot = (slot: UserAvailabilitySlot) => () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('fromDate', slot.from);
    newSearchParams.set('toDate', slot.to);
    setSearchParams(newSearchParams);
  };

  const selectedDate = searchParams.get('date');

  const days = availability.payload.map((availability) => (
    <AvailabilityDay
      key={availability.date}
      onClick={onChangeDate(availability)}
      availability={availability}
      selected={selectedDate}
    />
  ));

  const selectedSlotFrom = searchParams.get('fromDate');

  const slots = availability.payload
    .find(({date}) => date === selectedDate)
    ?.slots?.map((slot) => (
      <AvailabilityTime
        key={slot.from}
        onClick={onChangeSlot(slot)}
        slot={slot}
        selected={selectedSlotFrom}
      />
    ));

  return (
    <Stack gap="xl">
      {days ? (
        <Carousel
          slideSize={{base: '100px'}}
          align="start"
          slideGap="sm"
          controlsOffset="xs"
          controlSize={40}
          containScroll="trimSnaps"
          style={{paddingLeft: '60px', paddingRight: '60px'}}
        >
          {days}
        </Carousel>
      ) : null}

      {slots ? (
        <div>
          <Title order={3} mb="sm">
            Vælge tid:
          </Title>
          <SimpleGrid cols={3} spacing="sm">
            {slots}
          </SimpleGrid>
        </div>
      ) : null}
    </Stack>
  );
}

function AvailabilityDay({
  availability,
  selected,
  onClick,
}: {
  availability: UserAvailability;
  selected: string | null;
  onClick: () => void;
}) {
  return (
    <Carousel.Slide key={availability.date}>
      <MultilineButton
        onClick={onClick}
        variant={
          availability.date.substring(0, 10) === selected?.substring(0, 10)
            ? 'filled'
            : 'light'
        }
      >
        <Text size="sm" ta="center" fw={500}>
          {format(new Date(availability.date), 'EEEE', {locale: da})}
        </Text>
        <Text size="md" ta="center" fw={500}>
          {format(new Date(availability.date), 'PP', {locale: da}).slice(0, -6)}
        </Text>
      </MultilineButton>
    </Carousel.Slide>
  );
}

function AvailabilityTime({
  slot,
  selected,
  onClick,
}: {
  slot: UserAvailabilitySlot;
  selected?: string | null;
  onClick: () => void;
}) {
  return (
    <Button
      variant={slot.from === selected ? 'filled' : 'light'}
      onClick={onClick}
    >
      {format(new Date(slot.from), 'HH:mm', {locale: da})}
    </Button>
  );
}
