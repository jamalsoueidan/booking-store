import {Carousel} from '@mantine/carousel';
import {Button, Stack, Stepper, Title} from '@mantine/core';
import {useLoaderData, useSearchParams} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {format} from 'date-fns';
import {da} from 'date-fns/locale';
import {createRef, useCallback, useState} from 'react';
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
  const [active, setActive] = useState(2);
  const [searchParams, setSearchParams] = useSearchParams();
  const availabilityDateInput = createRef<HTMLInputElement>();
  const availabilitySlotInput = createRef<HTMLInputElement>();

  const productIds = searchParams.getAll('productIds');

  const changeAvailabilityDateInput = useCallback(
    ({date}: CustomerAvailability) =>
      () => {
        if (availabilityDateInput.current) {
          availabilityDateInput.current.value = date.substring(0, 10);
          setSearchParams({
            productIds,
            availabilityDate: availabilityDateInput.current.value,
          });
        }
      },
    [availabilityDateInput, productIds, setSearchParams],
  );

  const availabilityDate = availability.payload.map((availability) => {
    return (
      <Carousel.Slide key={availability.date}>
        <Button onClick={changeAvailabilityDateInput(availability)}>
          <p className="text-xs text-gray-900 dark:text-white">
            {format(new Date(availability.date), 'iiii', {locale: da})}
          </p>
          <p className="text-sm text-gray-900 dark:text-white break-keep">
            {format(new Date(availability.date), 'PPP', {locale: da}).slice(
              0,
              -4,
            )}
          </p>
        </Button>
      </Carousel.Slide>
    );
  });

  const changeAvailabilitySlotInput = useCallback(
    (slot: CustomerAvailabilitySlotsItem) => () => {
      if (availabilitySlotInput.current) {
        availabilitySlotInput.current.value = slot.from
          .substring(11, 16)
          .replace(':', '-');
        setSearchParams({
          productIds,
          availabilitySlot: availabilitySlotInput.current.value,
        });
      }
    },
    [availabilitySlotInput, productIds, setSearchParams],
  );

  const availabilitySlot = availability.payload
    .find(
      ({date}) =>
        date.substring(0, 10) === searchParams.get('availabilityDate'),
    )
    ?.slots?.map((slot) => {
      return (
        <Carousel.Slide key={slot.from}>
          <Button onClick={changeAvailabilitySlotInput(slot)}>
            {format(new Date(slot.from), 'HH:mm', {locale: da})}
          </Button>
        </Carousel.Slide>
      );
    });

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
          <input
            type="hidden"
            defaultValue={searchParams.get('availabilityDate') || ''}
            name="availabilityDate"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            ref={availabilityDateInput}
          />
          <input
            type="hidden"
            defaultValue={searchParams.get('availabilitySlot') || ''}
            name="availabilitySlot"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            ref={availabilitySlotInput}
          />

          <Title order={3} mb="sm">
            Vælge dato:
          </Title>
          {availabilityDate ? (
            <Carousel
              slideSize={{base: '20%'}}
              align="start"
              slideGap="sm"
              controlsOffset="xs"
              controlSize={40}
              containScroll="keepSnaps"
              style={{paddingLeft: '60px', paddingRight: '60px'}}
            >
              {availabilityDate}
            </Carousel>
          ) : null}

          <Title order={3} mb="sm" mt="xl ">
            Vælge tid:
          </Title>
          {availabilitySlot ? (
            <Carousel
              slideSize={{base: '5%'}}
              align="start"
              slideGap="sm"
              controlsOffset="xs"
              controlSize={40}
              containScroll="keepSnaps"
              style={{paddingLeft: '60px', paddingRight: '60px'}}
            >
              {availabilitySlot}
            </Carousel>
          ) : null}
        </Stepper.Step>
        <Stepper.Completed>
          Completed, click back button to get to previous step
        </Stepper.Completed>
      </Stepper>
    </Stack>
  );
}
