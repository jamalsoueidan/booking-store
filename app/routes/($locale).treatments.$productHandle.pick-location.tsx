import {Flex} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {useLoaderData, useSearchParams} from '@remix-run/react';
import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {LocationModal} from '~/components/LocationModal';
import {AristLocationRadioCard} from '~/components/artist/ArtistLocationRadioCard';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {
  CustomerLocationBaseLocationType,
  type CustomerLocation,
} from '~/lib/api/model';

export function shouldRevalidate() {
  return false;
}

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const {productHandle} = params;
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const username = searchParams.get('username');

  if (!username || !productHandle) {
    throw new Response('Expected username handle to be defined', {status: 400});
  }

  try {
    const {payload: schedule} =
      await getBookingShopifyApi().userScheduleGetByProduct(
        username,
        productHandle,
      );

    const url = new URL(request.url);
    if (
      schedule.locations.length === 1 &&
      url.searchParams.get('locationId') === null
    ) {
      url.searchParams.set('locationId', schedule.locations[0]._id);
      return redirect(url.toString(), {
        status: 302,
      });
    }

    return json({
      schedule,
    });
  } catch (err) {
    throw new Response('Username or product handle is wrong', {status: 404});
  }
}

export default function TreatmentHandlePickLocation() {
  const [opened, {open, close}] = useDisclosure(false);
  const {schedule} = useLoaderData<typeof loader>();
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
  const shippingId = searchParams.get('shippingId');

  const setLocationId = (value: CustomerLocation | undefined) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('locationId');
    if (value) {
      newSearchParams.set('locationId', value._id);
    }
    newSearchParams.delete('shippingId');
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

      {shippingId ? (
        <input type="hidden" name="shippingId" value={shippingId} />
      ) : null}

      <LocationModal
        location={selectedLocation}
        onAccept={onAccept}
        onCancel={onCancel}
        opened={opened}
      />
    </>
  );
}
