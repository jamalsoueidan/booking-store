import {Button, Grid, Stack, Text, Title} from '@mantine/core';
import {Link, useOutletContext, useSearchParams} from '@remix-run/react';
import {OptionSelector, ProductOption} from '~/components/OptionSelector';

import {Trans, useTranslation} from 'react-i18next';
import {BookingDetails, type OutletLoader} from './book.$handle';

export default function ProductDescription() {
  const {t} = useTranslation(['book', 'global']);
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
              {t('steps', {step: 1, total: 4})}
            </Text>
            <Title order={1} fw={600} size="h2">
              {t('index_title')}
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
                    {t('index_subtitle')}
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
              <Trans
                i18nKey="index_no_options"
                ns="book"
                components={{1: <strong />}}
              />
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
          {t('continue', {ns: 'global'})}
        </Button>
      </BookingDetails>
    </>
  );
}
