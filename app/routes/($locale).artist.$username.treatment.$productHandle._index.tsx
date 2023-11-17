import {Button, Flex, Group, Stepper, Text, Title} from '@mantine/core';
import {useLoaderData, useNavigate} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useState} from 'react';
import {ButtonCard} from '~/components/ButtonCard';
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
        <Title order={3} mb="sm">
          Lokationer:
        </Title>
        <Text mb="sm">
          Skønhedseksperten giver dig mulighed for at fuldføre den her
          behandling to forskellig steder, du skal vælge hvor du ønsker
          behandling skal ske?
        </Text>

        <LocationStep locations={schedule.locations} />
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
      <ButtonCard
        key={location._id}
        withRadio
        checked={selectedLocation?._id === location._id}
        value={location._id}
        onChange={onClick(location)}
        name="locationId"
      >
        <Text tt="uppercase" c="dimmed" fw={700} size="xs">
          {location.name}
        </Text>
        <Text mt="xs" mb="md" c="black">
          {location.fullAddress}
        </Text>
        <Group wrap="nowrap" gap="xs">
          <Group gap="xs" wrap="nowrap">
            {location.locationType === 'destination' ? (
              <Text size="xs">Kører til din adresse</Text>
            ) : null}
            {location.locationType !== 'destination' ? (
              <>
                <Text size="xs">
                  {location.originType === 'home'
                    ? 'Hjemmeadrsese'
                    : 'Salon/Klink'}
                </Text>
              </>
            ) : null}
          </Group>
        </Group>
      </ButtonCard>
    );
  });

  return (
    <form method="get" style={{maxWidth: '100%'}} onSubmit={onSubmit}>
      <Flex gap="md" mb="md">
        {markup}
      </Flex>
      <Group justify="center">
        <Button type="submit">Næste</Button>
      </Group>
    </form>
  );
}
