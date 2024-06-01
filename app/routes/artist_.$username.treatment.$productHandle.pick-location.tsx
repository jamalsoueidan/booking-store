import {Button, Flex, Grid, Stack, Text, Title} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {Link, useOutletContext, useSearchParams} from '@remix-run/react';
import {LocationModal} from '~/components/LocationModal';
import {AristLocationRadioCard} from '~/components/artist/ArtistLocationRadioCard';
import {
  CustomerLocationBaseLocationType,
  type CustomerLocation,
} from '~/lib/api/model';
import {convertLocations} from '~/lib/convertLocations';
import {
  BookingDetails,
  type OutletLoader,
} from './artist_.$username.treatment.$productHandle';

export default function ArtistTreatmentPickLocation() {
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
              Trin 2 ud af 4
            </Text>

            <Title order={1} fw={600} size="h2">
              Vælg lokation
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
          Forsæt
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
