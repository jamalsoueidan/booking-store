import {Button, Flex, Text, Title} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {Link, useOutletContext, useSearchParams} from '@remix-run/react';
import {type SerializeFrom} from '@remix-run/server-runtime';
import {ArtistShell} from '~/components/ArtistShell';
import {LocationModal} from '~/components/LocationModal';
import {TreatmentStepper} from '~/components/TreatmentStepper';
import {AristLocationRadioCard} from '~/components/artist/ArtistLocationRadioCard';
import {
  CustomerLocationBaseLocationType,
  type CustomerLocation,
} from '~/lib/api/model';
import {convertLocations} from '~/lib/convertLocations';
import type {loader as rootLoader} from './artist_.$username.treatment.$productHandle';

export default function ArtistTreatmentPickLocation() {
  const {product} = useOutletContext<SerializeFrom<typeof rootLoader>>();
  const [searchParams] = useSearchParams();
  const isDisabled =
    !searchParams.has('locationId') || searchParams.get('locationId') === '';

  const locations = convertLocations(product.locations?.references?.nodes);

  return (
    <>
      <ArtistShell.Main>
        <ArtistLocationPicker locations={locations} />
      </ArtistShell.Main>
      <ArtistShell.Footer>
        <TreatmentStepper>
          <Button
            variant="default"
            component={Link}
            to={`../?${searchParams.toString()}`}
          >
            Tilbage
          </Button>
          <Button
            variant="default"
            component={Link}
            to={`../pick-more?${searchParams.toString()}`}
            disabled={isDisabled}
          >
            Næste
          </Button>
        </TreatmentStepper>
      </ArtistShell.Footer>
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
    setSearchParams((prev) => {
      prev.set('shippingId', value);
      return prev;
    });
  };

  const setLocationId = (value: CustomerLocation | undefined) => {
    if (!value) {
      return;
    }
    setSearchParams((prev) => {
      prev.delete('locationId');
      prev.delete('shippingId');
      prev.set('locationId', value._id);
      return prev;
    });
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
      <Flex direction="column" justify="center" mb="lg">
        <Title order={4} fw={600} fz={{base: 'h1'}} ta="center">
          Lokation
        </Title>

        <Text c="dimmed" ta="center">
          Vælg behandlingslokation hvor du vil lave behandlingen.
        </Text>
      </Flex>

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
