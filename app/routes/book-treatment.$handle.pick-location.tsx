import {
  Button,
  Flex,
  Grid,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {
  Link,
  useFetcher,
  useOutletContext,
  useSearchParams,
} from '@remix-run/react';
import {useEffect, useState} from 'react';
import {AristLocationRadioCard} from '~/components/artist/ArtistLocationRadioCard';
import {AddressAutocompleteInput} from '~/components/form/AddressAutocompleteInput';
import MobileModal from '~/components/MobileModal';
import {
  CustomerLocationBaseLocationType,
  type CustomerLocation,
  type Shipping,
} from '~/lib/api/model';
import {convertLocations} from '~/lib/convertLocations';
import {useTranslations} from '~/providers/Translation';
import {BookingDetails, type OutletLoader} from './book-treatment.$handle';

export default function ArtistTreatmentPickLocation() {
  const {t} = useTranslations();
  const {product} = useOutletContext<OutletLoader>();
  const [searchParams] = useSearchParams();
  const isDisabled =
    !searchParams.has('locationId') || searchParams.get('locationId') === '';

  const locations = convertLocations(product.locations?.references?.nodes);

  return (
    <>
      <Grid.Col span={{base: 12, md: 7}}>
        <Stack gap="xl">
          <div>
            <Text size="sm" c="dimmed">
              {t('artist_booking_steps', {step: 2, total: 4})}
            </Text>

            <Title order={1} fw={600} size="h2">
              {t('artist_booking_location_title')}
            </Title>
          </div>
          <ArtistLocationPicker locations={locations} />
        </Stack>
      </Grid.Col>
      <BookingDetails>
        <Button
          variant="fill"
          color="black"
          component={Link}
          to={`../pick-more?${searchParams.toString()}`}
          relative="route"
          prefetch="render"
          size="lg"
          disabled={isDisabled}
        >
          {t('continue')}
        </Button>
      </BookingDetails>
    </>
  );
}

function ArtistLocationPicker({locations}: {locations: CustomerLocation[]}) {
  const [opened, {open, close}] = useDisclosure(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const setShippingId = (value: string | undefined) => {
    if (!value) {
      return;
    }
    setSearchParams(
      (prev) => {
        prev.set('shippingId', value);
        return prev;
      },
      {preventScrollReset: true, replace: true},
    );
  };

  const setLocationId = (value: CustomerLocation | undefined) => {
    setSearchParams(
      (prev) => {
        prev.delete('locationId');
        prev.delete('shippingId');
        if (value) {
          prev.set('locationId', value?._id);
        } else {
          prev.delete('locationId');
        }
        return prev;
      },
      {preventScrollReset: true, replace: true},
    );
  };

  const locationId = searchParams.get('locationId');

  const selectedLocation = locations.find((l) => l._id === locationId);

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

  const markup = locations.map((location) => {
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
    <MobileModal
      opened={opened}
      onClose={onCancel}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
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

            <Text size="sm">
              Skønhedseksperten vil kører fra{' '}
              <strong>{location?.fullAddress}</strong>
            </Text>

            <input
              type="hidden"
              name="customerId"
              value={location?.customerId || ''}
            />
            <input
              type="hidden"
              name="locationId"
              value={location?._id || ''}
            />

            <TextInput
              label="Navn:"
              name="destination.name"
              placeholder="Hotel navn?"
            />

            <AddressAutocompleteInput
              label="Hvor skal skønhedseksperten køre til?"
              placeholder={location?.fullAddress || ''}
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
    </MobileModal>
  );
}
