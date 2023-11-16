import {
  Badge,
  Button,
  Flex,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Stepper,
  Text,
  Title,
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {useFetcher, useLoaderData} from '@remix-run/react';
import {Image, Money, parseGid} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useEffect, useState} from 'react';
import {AddressAutocompleteInput} from '~/components/AddressAutocompleteInput';
import {ButtonCard} from '~/components/ButtonCard';
import {PRODUCT_SIMPLE} from '~/data/fragments';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type CustomerLocation} from '~/lib/api/model';
import {durationToTime} from '~/lib/duration';

export type SearchParams = {
  [key: string]: string | undefined;
  locationId?: string;
};

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {productHandle, username} = params;

  if (!productHandle || !username) {
    throw new Error('Expected product handle to be defined');
  }

  const query = await context.storefront.query(PRODUCT_QUERY, {
    variables: {
      handle: productHandle,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  if (!query.product) {
    throw new Error('Expected product to be defined');
  }

  const url = new URL(request.url);
  const searchParams: SearchParams = {
    locationId: undefined,
  };

  for (const [key, value] of url.searchParams.entries()) {
    searchParams[key] = value;
  }

  const {payload: schedule} =
    await getBookingShopifyApi().userScheduleGetByProductId(
      username,
      parseGid(query.product.id).id,
    );

  const productVariant = query.product.variants.nodes.find(
    (v) => parseGid(v.id).id === schedule.product.variantId.toString(),
  );

  return json({
    product: query.product,
    schedule,
    searchParams,
    productVariant: productVariant!,
  });
}

export default function ArtistTreatments() {
  const {product, productVariant, schedule, searchParams} =
    useLoaderData<typeof loader>();
  const [active, setActive] = useState(searchParams.locationId ? 1 : 0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const artistService = schedule.product;

  return (
    <Stack gap="xl">
      <Stepper color="pink" active={active} onStepClick={setActive}>
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
        >
          <Title order={3} mb="sm">
            Valgt produkt(er):
          </Title>

          <SimpleGrid cols={3}>
            <ButtonCard checked value="asd">
              <Image
                data={product.images.nodes[0]}
                aspectRatio="4/5"
                sizes="(min-width: 45em) 20vw, 100vw"
              />

              <Text tt="uppercase" c="dimmed" fw={700} size="xs">
                {product.title}
              </Text>
              <Text mt="xs" mb="md" color="black" fw={700}>
                {product.title}
              </Text>
              <Group wrap="nowrap" gap="xs">
                <Group gap="xs" wrap="nowrap">
                  <Text size="xs">
                    {durationToTime(artistService?.duration ?? 0)}
                  </Text>
                </Group>
                <Text size="xs" c="dimmed">
                  •
                </Text>
                <Badge variant="light" color="gray" size="md">
                  <Money data={productVariant.price} />
                </Badge>
              </Group>
            </ButtonCard>
          </SimpleGrid>
        </Stepper.Step>

        <Stepper.Step
          label="Dato & Tid"
          description="Hvornår skal behandling ske?"
        >
          <Title order={3} mb="sm">
            Vælge dato/tid:
          </Title>
        </Stepper.Step>
        <Stepper.Completed>
          Completed, click back button to get to previous step
        </Stepper.Completed>
      </Stepper>
    </Stack>
  );
}

function LocationStep({locations}: {locations: CustomerLocation[]}) {
  const [opened, {open, close}] = useDisclosure(false);
  const [modal, setModal] = useState<CustomerLocation | undefined>(undefined);
  const [selectedLocation, setSelectedLocation] = useState<
    CustomerLocation | undefined
  >(undefined);

  const fetcher = useFetcher();

  const onClick = () => {
    if (!modal) {
      return;
    }

    const data = new FormData();
    data.append('locationId', modal._id);
    data.append('customerId', modal.customerId);

    data.append('destination.fullAddress', 'Sigridsvej 45 1 th, 8220 Brabrand');
    data.append('destination.name', 'Sigridsvej 45 1 th, 8220 Brabrand');

    fetcher.submit(data, {
      method: 'POST',
      action: '/api/shipping-calculate',
    });
  };

  const onChange = (location: CustomerLocation) => (checked: boolean) => {
    if (location.locationType === 'destination') {
      setModal(location);
      open();
    } else {
      setSelectedLocation(location);
    }
  };

  useEffect(() => {
    console.log(fetcher.data);
  }, [fetcher.data]);

  const markup = locations.map((location) => {
    return (
      <ButtonCard
        key={location._id}
        withRadio
        checked={selectedLocation?._id === location._id}
        value={location._id}
        onChange={onChange(location)}
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
    <form method="get" style={{maxWidth: '100%'}}>
      <Flex gap="md" mb="md">
        {markup}
      </Flex>
      <Group justify="center">
        <Button type="submit">Næste</Button>
      </Group>

      <Modal opened={opened} onClose={close} title="Authentication">
        <Text size="sm">
          Vi skal bruge mere information om, hvor Skønhedseksperten skal køre
          hen, for at kunne estimere udgifterne ved at komme til dig.
        </Text>

        <AddressAutocompleteInput
          label="Hvor skal der køresr til?"
          placeholder="Sigridsvej 45, 8220 Brabrand"
          name="address"
        />

        <Button onClick={onClick}></Button>
      </Modal>
    </form>
  );
}

const PRODUCT_QUERY = `#graphql
  ${PRODUCT_SIMPLE}
  query ArtistTreatment(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductSimple
    }
  }
`;
