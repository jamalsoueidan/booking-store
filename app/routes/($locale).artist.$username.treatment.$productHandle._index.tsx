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
import {useFetcher, useLoaderData} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useEffect, useState} from 'react';
import {AddressAutocompleteInput} from '~/components/AddressAutocompleteInput';
import {AristLocationRadioCard} from '~/components/artist/ArtistLocationRadioCard';
import {ArtistStepper} from '~/components/artist/ArtistStepper';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {
  CustomerLocationLocationType,
  type CustomerLocation,
  type ShippingCalculateResponsePayload,
  type ShippingCreateResponsePayload,
} from '~/lib/api/model';

export async function loader({params}: LoaderFunctionArgs) {
  const {productHandle, username} = params;

  if (!productHandle || !username) {
    throw new Error('Expected product handle to be defined');
  }

  const productId = productHandle.match(/\d+$/)![0];

  const {payload: schedule} =
    await getBookingShopifyApi().userScheduleGetByProduct(username, productId);

  return json({
    schedule,
    productHandle,
  });
}

export default function ArtistTreatments() {
  const [opened, {open, close}] = useDisclosure(false);
  const {schedule, productHandle} = useLoaderData<typeof loader>();
  const [shippingId, setShippingId] = useState<string | undefined>();
  const [selectedLocation, setSelectedLocation] = useState<
    CustomerLocation | undefined
  >(undefined);

  const onClick = (location: CustomerLocation) => () => {
    setShippingId(undefined);
    setSelectedLocation(location);
    if (location.locationType === CustomerLocationLocationType.destination) {
      open();
    }
  };

  const onCancel = () => {
    setSelectedLocation(undefined);
    setShippingId(undefined);
    close();
  };

  const onAccept = (shippingId: string) => {
    close();
    setShippingId(shippingId);
  };

  const markup = schedule.locations.map((location) => {
    return (
      <AristLocationRadioCard
        key={location._id}
        checked={selectedLocation?._id === location._id}
        value={location._id}
        onChange={onClick(location)}
        location={location}
      />
    );
  });

  return (
    <ArtistStepper
      active={0}
      title="Location"
      description="Vælge hvor du fortag behandling?"
    >
      <form
        method="get"
        style={{maxWidth: '100%'}}
        action={`${productHandle}/${selectedLocation?._id || ''}`}
      >
        <Flex gap="lg" pt="xl" pb="xl" direction={{base: 'column', sm: 'row'}}>
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

        <Group justify="center">
          <Button type="submit" disabled={!selectedLocation}>
            Næste
          </Button>
        </Group>
      </form>
    </ArtistStepper>
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

  const calculateShippingFetcher =
    useFetcher<ShippingCalculateResponsePayload>();
  const createShippingFetcher = useFetcher<ShippingCreateResponsePayload>();

  const back = () => {
    setView('init');
  };

  useEffect(() => {
    if (calculateShippingFetcher.data) {
      setView('accept');
    }
  }, [calculateShippingFetcher.data]);

  useEffect(() => {
    if (createShippingFetcher.data) {
      onAccept(createShippingFetcher.data._id);
    }
  }, [createShippingFetcher, onAccept]);

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
