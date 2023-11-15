import {
  Badge,
  Button,
  Flex,
  Group,
  SimpleGrid,
  Stack,
  Stepper,
  Text,
  Title,
} from '@mantine/core';
import {useLoaderData} from '@remix-run/react';
import {Image, Money, parseGid} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useCallback, useState} from 'react';
import {ButtonCard} from '~/components/ButtonCard';
import {PRODUCT_SIMPLE} from '~/data/fragments';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {durationToTime} from '~/lib/duration';

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

  const {payload: schedule} =
    await getBookingShopifyApi().userScheduleGetByProductId(
      username,
      parseGid(query.product.id).id,
    );

  return json({product: query.product, schedule});
}

export default function ArtistTreatments() {
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const {product, schedule} = useLoaderData<typeof loader>();

  const productVariant = product.variants.nodes.find(
    (v) => parseGid(v.id).id === schedule.product.variantId.toString(),
  );

  const artistService = schedule.product;

  const handleChange = useCallback((event: any) => {
    console.log('change');
  }, []);

  return (
    <Stack gap="xl">
      <form method="get" onChange={handleChange} style={{maxWidth: '100%'}}>
        <Stepper color="pink" active={active} onStepClick={setActive}>
          <Stepper.Step
            label="Lokation"
            description="Hvor skal behandling ske?"
          >
            <Title order={3} mb="sm">
              Lokationer:
            </Title>
            <Text mb="sm">
              Skønhedseksperten giver dig mulighed for at fuldføre den her
              behandling to forskellig steder, du skal vælge hvor du ønsker
              behandling skal ske?
            </Text>
            <Flex gap="md">
              {schedule.locations.map((location) => {
                return (
                  <ButtonCard key={location._id} withRadio onChange={() => {}}>
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
              })}
            </Flex>
          </Stepper.Step>
          <Stepper.Step
            label="Behandlinger"
            description="Hvilken behandlinger skal laves?"
          >
            <Title order={3} mb="sm">
              Valgt produkt(er):
            </Title>

            <SimpleGrid cols={3}>
              <ButtonCard checked>
                <Image
                  data={product.images.nodes[0]}
                  aspectRatio="4/5"
                  sizes="(min-width: 45em) 20vw, 100vw"
                />

                <Text tt="uppercase" c="dimmed" fw={700} size="xs">
                  {product.title}
                </Text>
                <Text mt="xs" mb="md">
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
                  <Text size="xs" c="dimmed">
                    {productVariant ? (
                      <Badge variant="light" color="gray" size="lg">
                        <Money data={productVariant.price} />
                      </Badge>
                    ) : null}
                  </Text>
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

        <Group justify="center">
          {active > 0 ? (
            <Button variant="default" onClick={prevStep}>
              Tilbage
            </Button>
          ) : null}
          <Button onClick={nextStep}>Næste</Button>
        </Group>
      </form>
    </Stack>
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
