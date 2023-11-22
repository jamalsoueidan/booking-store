import {Carousel} from '@mantine/carousel';
import {Button, Group, SimpleGrid, Stack, Text, Title} from '@mantine/core';
import {Form, useLoaderData, useLocation, useNavigate} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {format} from 'date-fns';
import {da} from 'date-fns/locale';
import {useState} from 'react';
import {MultilineButton} from '~/components/MultilineButton';
import {ArtistStepper} from '~/components/artist/ArtistStepper';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {
  type UserAvailability,
  type UserAvailabilitySlot,
} from '~/lib/api/model';

export async function loader({params, request}: LoaderFunctionArgs) {
  const {productHandle, username, locationId} = params;

  const url = new URL(request.url);
  const productIds = url.searchParams.getAll('productIds');
  const shippingId = url.searchParams.get('shippingId') as string | undefined;

  if (productIds.length === 0) {
    throw new Error('Expected productId to be selected');
  }

  if (!productHandle || !username || !locationId) {
    throw new Error('Expected product handle to be defined');
  }

  const availability = await getBookingShopifyApi().userAvailabilityGenerate(
    username,
    locationId,
    {
      productIds,
      fromDate: '2023-05-13',
      shippingId: shippingId ? shippingId : undefined, //stringify ignore undefined values but not NULL
    },
  );

  return json(availability);
}

export default function ArtistTreatmentsBooking() {
  const availability = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSlot, setSelectedSlot] = useState<
    UserAvailabilitySlot | undefined
  >();
  const [selectedDate, setSelectedDate] = useState<string>();

  const handleCloseClick = (event: any) => {
    event.preventDefault();
    navigate(-1);
  };

  const onChangeDate =
    ({date}: UserAvailability) =>
    () => {
      setSelectedDate(date);
      setSelectedSlot(undefined);
    };

  const onChangeSlot = (slot: UserAvailabilitySlot) => () => {
    setSelectedSlot(slot);
  };

  const days = availability.payload.map((availability) => (
    <AvailabilityDay
      key={availability.date}
      onClick={onChangeDate(availability)}
      availability={availability}
      selected={selectedDate}
    />
  ));

  const slots = availability.payload
    .find(({date}) => date === selectedDate)
    ?.slots?.map((slot) => (
      <AvailabilityTime
        key={slot.from}
        onClick={onChangeSlot(slot)}
        slot={slot}
        selected={selectedSlot?.from}
      />
    ));

  return (
    <ArtistStepper active={2} title="Dato/Tid" description="Vælge tidspunkt?">
      <Form
        method="post"
        action={`../completed${location.search}`}
        style={{maxWidth: '100%'}}
      >
        <Stack gap="xl" mb="md">
          <input
            type="hidden"
            name="fromDate"
            value={selectedSlot ? selectedSlot.from : ''}
            onChange={() => {}}
          />

          <input
            type="hidden"
            name="toDate"
            value={selectedSlot ? selectedSlot.to : ''}
            onChange={() => {}}
          />

          {days ? (
            <div>
              <Title order={3} mb="sm">
                Vælge dato:
              </Title>

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
            </div>
          ) : null}

          {slots ? (
            <div>
              <Title order={3} mb="sm">
                Vælge tid:
              </Title>
              <SimpleGrid
                cols={{base: 5, xl: 18, lg: 14, md: 10, sm: 6}}
                spacing="sm"
              >
                {slots}
              </SimpleGrid>
            </div>
          ) : null}
        </Stack>
        <Group justify="center">
          <Button onClick={handleCloseClick}>Tilbage</Button>
          <Button type="submit" disabled={!selectedDate || !selectedSlot}>
            Næste
          </Button>
        </Group>
      </Form>
    </ArtistStepper>
  );
}

function AvailabilityDay({
  availability,
  selected,
  onClick,
}: {
  availability: UserAvailability;
  selected?: string;
  onClick: () => void;
}) {
  return (
    <Carousel.Slide key={availability.date}>
      <MultilineButton
        onClick={onClick}
        variant={availability.date === selected ? 'filled' : 'light'}
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
  selected?: string;
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
