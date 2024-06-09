import {Button, Grid, Stack, Text, Title} from '@mantine/core';
import {Link, useOutletContext, useSearchParams} from '@remix-run/react';
import {OptionSelector, ProductOption} from '~/components/OptionSelector';

import {
  BookingDetails,
  type OutletLoader,
} from './artist_.$username.treatment.$productHandle';

export default function ProductDescription() {
  const [searchParams] = useSearchParams();
  const {product} = useOutletContext<OutletLoader>();

  const productOptions = product.options?.references?.nodes;

  const required = productOptions?.filter(
    (p) => p.required?.value.toLowerCase() === 'true',
  );

  const choices = productOptions?.filter(
    (p) => p.required?.value.toLowerCase() !== 'true',
  );

  return (
    <>
      <Grid.Col span={{base: 12, md: 7}}>
        <Stack gap="xl">
          <div>
            <Text size="sm" c="dimmed">
              Trin 1 ud af 4
            </Text>
            <Title order={1} fw={600} size="h2">
              Vælg detaljer
            </Title>
          </div>
          {productOptions ? (
            <>
              {required && required.length > 0 ? (
                <>
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
                </>
              ) : null}
              {choices && choices.length > 0 ? (
                <div>
                  <Title order={3} fw={600} mb="sm" fz="xl">
                    Tilvalg til den behandling
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
                </div>
              ) : null}
            </>
          ) : (
            <Text>
              Der er ingen detaljer at udfylde for dette produkt. Klik venligst
              på{' '}
              <Text component="span" fw="bold">
                Fortsæt
              </Text>
              .
            </Text>
          )}
        </Stack>
      </Grid.Col>

      <BookingDetails>
        <Button
          variant="fill"
          color="black"
          component={Link}
          to={`pick-location?${searchParams.toString()}`}
          relative="route"
          prefetch="render"
          size="lg"
        >
          Forsæt
        </Button>
      </BookingDetails>
    </>
  );
}
