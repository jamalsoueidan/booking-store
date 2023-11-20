import {Button, Flex, Group} from '@mantine/core';
import {useLoaderData, useNavigate} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useState} from 'react';
import {AristLocationRadioCard} from '~/components/artist/ArtistLocationRadioCard';
import {ArtistStepper} from '~/components/artist/ArtistStepper';
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
    <ArtistStepper
      active={0}
      title="Location"
      description="Vælge hvor du fortag behandling?"
    >
      <LocationStep locations={schedule.locations} />
    </ArtistStepper>
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
      <Flex gap="lg" pt="xl" pb="xl" direction={{base: 'column', sm: 'row'}}>
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
