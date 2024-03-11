import {
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Group,
  Text,
  Title,
} from '@mantine/core';
import {Form, Link, useLoaderData} from '@remix-run/react';
import {Money, parseGid} from '@shopify/hydrogen';
import {type ProductConnection} from '@shopify/hydrogen/storefront-api-types';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {AccountButton} from '~/components/account/AccountButton';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {durationToTime} from '~/lib/duration';
import {getCustomer} from '~/lib/get-customer';
import {ALL_PRODUCTS_QUERY} from './($locale).artist.$username._index';

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const customer = await getCustomer({context});
  const response = await getBookingShopifyApi().customerProductsList(
    customer.id,
  );

  const productIds = response.payload.map(({productId}) => productId);

  const data = await context.storefront.query<{
    products: ProductConnection;
  }>(ALL_PRODUCTS_QUERY, {
    variables: {
      first: productIds.length,
      query: productIds.length > 0 ? productIds.join(' OR ') : 'id=-',
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  return json({
    storeProducts: data.products,
    customerProducts: response.payload,
  });
}

export default function AccountServicesIndex() {
  const {storeProducts, customerProducts} = useLoaderData<typeof loader>();

  return (
    <>
      <AccountTitle heading="Ydelser">
        <AccountButton to={'create'}>Tilføj ydelse</AccountButton>
      </AccountTitle>

      <AccountContent>
        <Grid align="stretch">
          {storeProducts.nodes.map((product) => {
            const customerProduct = customerProducts.find(({productId}) => {
              return productId.toString() === parseGid(product.id).id;
            });

            return (
              <Grid.Col key={product.id} span={{base: 12, md: 6, lg: 4}}>
                <Card padding="sm" radius="md" h="100%" withBorder>
                  <Title order={4}>{product.title}</Title>

                  <Card.Section my="xs">
                    <Divider />
                  </Card.Section>

                  <Flex gap="xl">
                    <div style={{flex: 1}}>
                      <Text size="sm">Navn</Text>
                      <Text fw={600} size="sm">
                        {customerProduct?.scheduleName}
                      </Text>
                    </div>
                    <div style={{flex: 1}}>
                      <Text size="sm">Tid</Text>
                      <Text fw={600} size="sm">
                        {durationToTime(customerProduct?.duration ?? 0)}
                      </Text>
                    </div>
                    <div style={{flex: 1}}>
                      <Text size="sm">Pris</Text>
                      <Text fw={600} size="sm">
                        {customerProduct?.price && (
                          <Money
                            withoutTrailingZeros
                            data={customerProduct?.price as any}
                            as="span"
                          />
                        )}
                      </Text>
                    </div>
                  </Flex>

                  <Card.Section mt="xs" mb="sm">
                    <Divider />
                  </Card.Section>

                  <Group justify="flex-end">
                    <Button component={Link} to={`${parseGid(product.id).id}`}>
                      Rediger
                    </Button>

                    <Form
                      method="post"
                      action={`${parseGid(product.id).id}/destroy`}
                      style={{display: 'inline-block'}}
                    >
                      <Button
                        variant="light"
                        color="blue"
                        fullWidth
                        size="xs"
                        type="submit"
                      >
                        Slet
                      </Button>
                    </Form>
                  </Group>
                </Card>
              </Grid.Col>
            );
          })}
        </Grid>
      </AccountContent>
    </>
  );
}
