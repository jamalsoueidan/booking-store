import {Box, Flex, Skeleton} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {Await, useLoaderData, useSearchParams} from '@remix-run/react';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Suspense, useEffect} from 'react';
import {LocationModal} from '~/components/LocationModal';
import {AristLocationRadioCard} from '~/components/artist/ArtistLocationRadioCard';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {
  CustomerLocationBaseLocationType,
  type CustomerLocation,
  type UserScheduleGetByProductIdResponsePayload,
} from '~/lib/api/model';

export function shouldRevalidate() {
  return false;
}

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const {productHandle, username} = params;
  const url = new URL(request.url);

  if (!username || !productHandle) {
    throw new Response('Expected username handle to be defined', {status: 400});
  }

  try {
    const schedule = getBookingShopifyApi().userScheduleGetByProduct(
      username,
      productHandle,
    );

    return defer({
      schedule,
    });
  } catch (err) {
    throw new Response('Username or product handle is wrong', {status: 404});
  }
}

export default function ArtistTreatmentPickLocation() {
  const {schedule} = useLoaderData<typeof loader>();

  return (
    <Box mt="lg">
      <Suspense
        fallback={
          <div>
            <Skeleton height={50} mb="xl" />
            <Skeleton height={50} mb="xl" />
            <Skeleton height={50} mb="xl" />
          </div>
        }
      >
        <Await resolve={schedule}>
          {({payload}) => <TreatmentHandlePickLocation schedule={payload} />}
        </Await>
      </Suspense>
    </Box>
  );
}

function TreatmentHandlePickLocation({
  schedule,
}: {
  schedule: UserScheduleGetByProductIdResponsePayload;
}) {
  const [opened, {open, close}] = useDisclosure(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const setShippingId = (value: string | undefined) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set('shippingId', value);
    }
    setSearchParams(newSearchParams, {
      state: {
        key: 'booking',
      },
    });
  };

  const setLocationId = (value: CustomerLocation | undefined) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('locationId');
    newSearchParams.delete('shippingId');
    if (value) {
      newSearchParams.set('locationId', value._id);
    }
    setSearchParams(newSearchParams, {
      state: {
        key: 'booking',
      },
    });
  };

  const locationId = searchParams.get('locationId');

  const selectedLocation = schedule.locations.find((l) => l._id === locationId);

  const onChange = (location: CustomerLocation) => () => {
    setLocationId(location);
    if (
      location.locationType === CustomerLocationBaseLocationType.destination
    ) {
      open();
    }
  };

  const onCancel = () => {
    setLocationId(undefined);
    close();
  };

  const onAccept = (shippingId: string) => {
    setShippingId(shippingId);
    close();
  };

  useEffect(() => {
    if (schedule.locations.length === 1 && !searchParams.has('locationId')) {
      setLocationId(schedule.locations[0]);
    }
  }, []);

  const markup = schedule.locations.map((location) => {
    return (
      <AristLocationRadioCard
        key={location._id}
        checked={locationId === location._id}
        value={location._id}
        onChange={onChange(location)}
        location={location}
      />
    );
  });

  return (
    <>
      <Flex gap="lg" direction="column">
        {markup}
      </Flex>

      {opened && (
        <LocationModal
          location={selectedLocation}
          onAccept={onAccept}
          onCancel={onCancel}
          opened={true}
        />
      )}
    </>
  );
}
