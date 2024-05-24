import {Button, Flex, Stack, Text, Title} from '@mantine/core';
import {Link, useOutletContext, useSearchParams} from '@remix-run/react';
import {ArtistShell} from '~/components/ArtistShell';
import {OptionSelector, ProductOption} from '~/components/OptionSelector';
import {TreatmentStepper} from '~/components/TreatmentStepper';

import type {OutletLoader} from './artist_.$username.treatment.$productHandle';

export default function ProductDescription() {
  const [searchParams] = useSearchParams();

  const {product, totalPrice, totalDuration} = useOutletContext<OutletLoader>();

  const productOptions = product.options?.references?.nodes;

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
          </>
        ) : null}
      </ArtistShell.Main>
      <ArtistShell.Footer>
        <TreatmentStepper
          totalPrice={totalPrice}
          totalDuration={totalDuration}
          withBackButton={false}
        >
          <Button
            variant="default"
            component={Link}
            to={`pick-location?${searchParams.toString()}`}
            relative="route"
            prefetch="render"
          >
            Bestil tid
          </Button>
        </TreatmentStepper>
      </ArtistShell.Footer>
    </>
  );
}
