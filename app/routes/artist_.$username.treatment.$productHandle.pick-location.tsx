import {Button, Flex, Skeleton, Title} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {
  Await,
  Link,
  useLoaderData,
  useLocation,
  useSearchParams,
} from '@remix-run/react';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import {ArtistShell} from '~/components/ArtistShell';
import {LocationModal} from '~/components/LocationModal';
import {TreatmentStepper} from '~/components/TreatmentStepper';
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

  if (!username || !productHandle) {
    throw new Response('Expected username handle to be defined', {status: 400});
  }

  const schedule = getBookingShopifyApi().userScheduleGetByProduct(
    username,
    productHandle,
  );

  return defer({
    schedule,
  });
}

export default function ArtistTreatmentPickLocation() {
  const {schedule} = useLoaderData<typeof loader>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isDisabled =
    !searchParams.has('locationId') || searchParams.get('locationId') === '';

  return (
    <>
      <ArtistShell.Main>
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
            {({payload}) => <ArtistLocationPicker schedule={payload} />}
          </Await>
        </Suspense>
      </ArtistShell.Main>
      <ArtistShell.Footer>
        <TreatmentStepper currentStep={1} totalSteps={3} pageTitle="Lokation">
          <Button variant="default" component={Link} to="../">
            Tilbage
          </Button>
          <Button
            variant="default"
            component={Link}
            to={`../pick-more${location.search}`}
            disabled={isDisabled}
          >
            Næste
          </Button>
        </TreatmentStepper>
      </ArtistShell.Footer>
    </>
  );
}

function ArtistLocationPicker({
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
    setSearchParams(newSearchParams);
  };

  const setLocationId = (value: CustomerLocation | undefined) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('locationId');
    newSearchParams.delete('shippingId');
    if (value) {
      newSearchParams.set('locationId', value._id);
    }
    setSearchParams(newSearchParams);
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
      <Title order={4} mb="sm" fw={600} size="md">
        Vælg behandlingslokation:
      </Title>

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
