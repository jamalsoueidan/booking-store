import {Carousel} from '@mantine/carousel';
import {
  Button,
  Group,
  SimpleGrid,
  Stack,
  Stepper,
  Text,
  Title,
} from '@mantine/core';
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {format} from 'date-fns';
import {da} from 'date-fns/locale';
import {createRef, useCallback, useState} from 'react';
import {MultilineButton} from '~/components/MultilineButton';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {
  type CustomerAvailability,
  type CustomerAvailabilitySlotsItem,
} from '~/lib/api/model';

export async function loader({params, request}: LoaderFunctionArgs) {
  const {productHandle, username, locationId} = params;

  const url = new URL(request.url);
  const productIds = url.searchParams.getAll('productIds');

  if (productIds.length === 0) {
    throw new Error('Expected productId to be selected');
  }

  if (!productHandle || !username || !locationId) {
    throw new Error('Expected product handle to be defined');
  }

  const {payload: user} = await getBookingShopifyApi().userGet(username);

  const availability = await getBookingShopifyApi().customerAvailabilityGet(
    user.customerId.toString(),
    locationId,
    {
      productIds,
      startDate: '2023-05-13',
      shippingId: undefined,
    },
  );

  return json(availability);
}

export default function ArtistTreatmentsBooking() {
  const availability = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [active, setActive] = useState(2);
  const [selectedTimer, setSelectedTimer] = useState<string>();
  const [selectedDay, setSelectedDay] = useState<string>();

  const availabilityDateInput = createRef<HTMLInputElement>();
  const availabilitySlotInput = createRef<HTMLInputElement>();

  const handleCloseClick = (event: any) => {
    event.preventDefault();
    navigate(-1);
  };

  const changeDay = useCallback(
    ({date}: CustomerAvailability) =>
      () => {
        if (availabilityDateInput.current) {
          availabilityDateInput.current.value = date.substring(0, 10);
          setSelectedDay(date);
        }
      },
    [availabilityDateInput],
  );

  const changeTimer = useCallback(
    (slot: CustomerAvailabilitySlotsItem) => () => {
      if (availabilitySlotInput.current) {
        availabilitySlotInput.current.value = slot.from
          .substring(11, 16)
          .replace(':', '-');
        setSelectedTimer(slot.from);
      }
    },
    [availabilitySlotInput],
  );

  const days = availability.payload.map((availability) => (
    <AvailabilityDay
      key={availability.date}
      onClick={changeDay(availability)}
      availability={availability}
      selected={selectedDay}
    />
  ));

  const slots = availability.payload
    .find(({date}) => date === selectedDay)
    ?.slots?.map((slot) => (
      <AvailabilityTime
        key={slot.from}
        onClick={changeTimer(slot)}
        slot={slot}
        selected={selectedTimer}
      />
    ));

  return (
    <Stack gap="xl">
      <Stepper color="pink" active={active} onStepClick={setActive}>
        <Stepper.Step
          label="Lokation"
          description="Hvor skal behandling ske?"
        ></Stepper.Step>
        <Stepper.Step
          label="Behandlinger"
          description="Hvilken behandlinger skal laves?"
        ></Stepper.Step>
        <Stepper.Step
          label="Dato & Tid"
          description="Hvornår skal behandling ske?"
        >
          <form
            method="post"
            action={`completed${location.search}`}
            style={{maxWidth: '100%'}}
          >
            <Stack gap="xl" mb="md">
              <input
                type="hidden"
                defaultValue={selectedDay}
                name="availabilityDate"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                ref={availabilityDateInput}
              />
              <input
                type="hidden"
                defaultValue={selectedTimer}
                name="availabilitySlot"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                ref={availabilitySlotInput}
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
              <Button type="submit" disabled={!selectedDay || !selectedTimer}>
                Næste
              </Button>
            </Group>
          </form>
        </Stepper.Step>
      </Stepper>
    </Stack>
  );
}

function AvailabilityDay({
  availability,
  selected,
  onClick,
}: {
  availability: CustomerAvailability;
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
  slot: CustomerAvailabilitySlotsItem;
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
