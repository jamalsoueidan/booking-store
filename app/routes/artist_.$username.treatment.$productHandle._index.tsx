import {Button, Divider, Flex, Stack, Text, Title} from '@mantine/core';
import {Link, useOutletContext, useSearchParams} from '@remix-run/react';
import {type SerializeFrom} from '@remix-run/server-runtime';
import {Money} from '@shopify/hydrogen';
import {ArtistShell} from '~/components/ArtistShell';
import {
  OptionSelector,
  ProductOption,
  useCalculateDurationAndPrice,
} from '~/components/OptionSelector';
import {TreatmentStepper} from '~/components/TreatmentStepper';

import {durationToTime} from '~/lib/duration';
import type {loader as rootLoader} from './artist_.$username.treatment.$productHandle';

export default function ProductDescription() {
  const [searchParams] = useSearchParams();

  const {product} = useOutletContext<SerializeFrom<typeof rootLoader>>();

  const productOptions = product.options?.references?.nodes;

  const {totalDuration, totalPrice} = useCalculateDurationAndPrice({
    parentId: product.id,
    productOptions,
    currentPrice: parseInt(product.variants.nodes[0]?.price.amount || '0'),
    currentDuration: parseInt(product.duration?.value || '0'),
  });

  const required = productOptions?.filter(
    (p) => p.required?.value.toLowerCase() === 'true',
  );

  const choices = productOptions?.filter(
    (p) => p.required?.value.toLowerCase() !== 'true',
  );

  return (
    <>
      <ArtistShell.Main>
        <Flex direction="column" justify="center" mb="lg">
          <Title order={2} fw={600} fz="h2" ta="center">
            Produkt
          </Title>

          <Text c="dimmed" ta="center">
            Produkt beskrivelse {productOptions ? 'samt ekstra valg' : ''}
          </Text>
        </Flex>
        <Text c="dimmed" fw={400}>
          {product.description}
        </Text>
        {productOptions ? (
          <>
            <Title order={3} fw={600} mt="xl" mb="sm" fz="h3" ta="center">
              Påkrævet valg
            </Title>
            <Stack gap="md">
              {required?.map((productWithVariants) => {
                return (
                  <OptionSelector
                    key={productWithVariants.id}
                    productWithVariants={productWithVariants}
                  >
                    {(props) => {
                      return <ProductOption {...props} />;
                    }}
                  </OptionSelector>
                );
              })}
            </Stack>
            <Title order={3} fw={600} mt="xl" mb="sm" fz="h3" ta="center">
              Vælg tilvalg:
            </Title>
            <Stack gap="md">
              {choices?.map((productWithVariants) => {
                return (
                  <OptionSelector
                    key={productWithVariants.id}
                    productWithVariants={productWithVariants}
                  >
                    {(props) => {
                      return <ProductOption {...props} />;
                    }}
                  </OptionSelector>
                );
              })}
            </Stack>
            <Divider my="sm" />
            <Text>
              Total pris:{' '}
              <Money
                as="span"
                data={{
                  __typename: 'MoneyV2',
                  amount: totalPrice?.toString(),
                  currencyCode: 'DKK',
                }}
              />
            </Text>
            Total tid: {durationToTime(totalDuration ?? 0)}
          </>
        ) : null}
      </ArtistShell.Main>
      <ArtistShell.Footer>
        <TreatmentStepper>
          <Button
            variant="default"
            component={Link}
            to={`pick-location?${searchParams.toString()}`}
            relative="route"
          >
            Bestil tid
          </Button>
        </TreatmentStepper>
      </ArtistShell.Footer>
    </>
  );
}
