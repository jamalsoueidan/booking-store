import {
  Button,
  Flex,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {useFetcher, useLoaderData, useSearchParams} from '@remix-run/react';
import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useEffect, useState} from 'react';
import {AddressAutocompleteInput} from '~/components/AddressAutocompleteInput';
import {AristLocationRadioCard} from '~/components/artist/ArtistLocationRadioCard';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {
  CustomerLocationLocationType,
  type CustomerLocation,
  type Shipping,
} from '~/lib/api/model';

export function shouldRevalidate() {
  return false;
}

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const {productHandle} = params;
  const {storefront} = context;
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
    setSearchParams(newSearchParams);
  };
  const shippingId = searchParams.get('shippingId');

  const setLocationId = (value: CustomerLocation | undefined) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('locationId');
    if (value) {
      newSearchParams.set('locationId', value._id);
    }
    newSearchParams.delete('shippingId');
    setSearchParams(newSearchParams);
  };

  const locationId = searchParams.get('locationId');

  const selectedLocation = schedule.locations.find((l) => l._id === locationId);

  const onChange = (location: CustomerLocation) => () => {
    setLocationId(location);
    if (location.locationType === CustomerLocationLocationType.destination) {
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

type LocationModalProps = {
  location?: CustomerLocation;
  onCancel: () => void;
  onAccept: (shippingId: string) => void;
  opened: boolean;
};

function LocationModal({
  location,
  onCancel,
  onAccept,
  opened,
}: LocationModalProps) {
  const [view, setView] = useState('init');

  const calculateShippingFetcher = useFetcher<Shipping>();
  const createShippingFetcher = useFetcher<Shipping>();

  const back = () => {
    setView('init');
  };

  useEffect(() => {
    if (calculateShippingFetcher.data && opened) {
      setView('accept');
    }
  }, [calculateShippingFetcher.data, opened]);

  useEffect(() => {
    // don't remove opened, or else it will keep throwing onAccept!
    if (createShippingFetcher.data && opened) {
      onAccept(createShippingFetcher.data._id);
    }
  }, [createShippingFetcher, onAccept, opened]);

  return (
    <Modal
      opened={opened}
      onClose={onCancel}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      centered
      title="Lokation"
    >
      {view === 'init' ? (
        <calculateShippingFetcher.Form
          method="post"
          action="/api/shipping-calculate"
        >
          <Stack gap="lg">
            <Text size="sm">
              Vi skal bruge mere information om, hvor Skønhedseksperten skal
              køre hen, for at kunne estimere udgifterne ved at komme til dig.
            </Text>

            <input
              type="hidden"
              name="customerId"
              value={location?.customerId}
            />
            <input type="hidden" name="locationId" value={location?._id} />

            <TextInput label="Navn (hotel):" name="destination.name" />

            <AddressAutocompleteInput
              label="Hvor skal der køresr til?"
              placeholder="Sigridsvej 45, 8220 Brabrand"
              name="destination.fullAddress"
            />

            <Group justify="flex-end">
              <Button
                type="submit"
                loading={calculateShippingFetcher.state === 'loading'}
              >
                Næste
              </Button>
            </Group>
          </Stack>
        </calculateShippingFetcher.Form>
      ) : (
        <createShippingFetcher.Form method="post" action="/api/shipping-create">
          <input type="hidden" name="customerId" value={location?.customerId} />
          <input type="hidden" name="locationId" value={location?._id} />
          <input
            type="hidden"
            name="destination.name"
            value={calculateShippingFetcher?.data?.destination.name}
          />
          <input
            type="hidden"
            name="destination.fullAddress"
            value={calculateShippingFetcher?.data?.destination.fullAddress}
          />
          <Stack gap="lg">
            <div>
              <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                Omkostninger
              </Text>
              <Text fz="lg" fw={500}>
                {calculateShippingFetcher?.data?.cost.value}{' '}
                {calculateShippingFetcher?.data?.cost.currency}
              </Text>
            </div>
            <div>
              <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                Afstand
              </Text>
              <Text fz="lg" fw={500}>
                {calculateShippingFetcher?.data?.distance.text}
              </Text>
            </div>
            <div>
              <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                Tid
              </Text>
              <Text fz="lg" fw={500}>
                {calculateShippingFetcher?.data?.duration.text}
              </Text>
            </div>
            <Group justify="space-between">
              <Button onClick={onCancel}>Luk</Button>
              <Group justify="flex-end">
                <Button onClick={back}>Tilbage</Button>
                <Button type="submit">Acceptere</Button>
              </Group>
            </Group>
          </Stack>
        </createShippingFetcher.Form>
      )}
    </Modal>
  );
}
