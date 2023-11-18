import {Button, Flex, Group, Stack, Stepper, Text, Title} from '@mantine/core';
import {useLoaderData, useNavigate} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useState} from 'react';
import {AristLocationRadioCard} from '~/components/artist/ArtistLocationRadioCard';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type CustomerLocation} from '~/lib/api/model';

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
  });
}

export default function ArtistTreatments() {
  const {schedule} = useLoaderData<typeof loader>();

  return (
    <Stepper color="pink" active={0}>
      <Stepper.Step label="Lokation" description="Hvor skal behandling ske?">
        <Stack gap="xl" mt="xl">
          <div>
            <Title order={2} tt="uppercase" ta="center" mb="md">
              Lokation
            </Title>
            <Text c="dimmed" ta="center">
              Vælge hvor du fortag behandling?
            </Text>
          </div>

          <LocationStep locations={schedule.locations} />
        </Stack>
      </Stepper.Step>
      <Stepper.Step
        label="Behandlinger"
        description="Hvilken behandlinger skal laves?"
      ></Stepper.Step>

      <Stepper.Step
        label="Dato & Tid"
        description="Hvornår skal behandling ske?"
      ></Stepper.Step>
    </Stepper>
  );
}

function LocationStep({locations}: {locations: CustomerLocation[]}) {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<
    CustomerLocation | undefined
  >(undefined);

  const onClick = (location: CustomerLocation) => () => {
    setSelectedLocation(location);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(selectedLocation?._id || '');
  };

  const markup = locations.map((location) => {
    return (
      <AristLocationRadioCard
        key={location._id}
        checked={selectedLocation?._id === location._id}
        value={location._id}
        onChange={onClick(location)}
        name="locationId"
        location={location}
      />
    );
  });

  return (
    <form method="get" style={{maxWidth: '100%'}} onSubmit={onSubmit}>
      <Flex gap="lg" p="xl">
        {markup}
      </Flex>
      <Group justify="center">
        <Button type="submit" disabled={!selectedLocation}>
          Næste
        </Button>
      </Group>
    </form>
  );
}
