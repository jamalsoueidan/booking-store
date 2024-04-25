import {Link, useLoaderData} from '@remix-run/react';
import {type ProductConnection} from '@shopify/hydrogen/storefront-api-types';

import {
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  rem,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  CacheLong,
  Money,
  parseGid,
  Image as ShopifyImage,
} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconMoodSad, IconPlus} from '@tabler/icons-react';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {durationToTime} from '~/lib/duration';
import {getCustomer} from '~/lib/get-customer';
import {ALL_PRODUCTS_QUERY} from './artist.$username._index';

export async function loader({context, params}: LoaderFunctionArgs) {
  const {storefront} = context;
  const customerId = await getCustomer({context});

  const {locationId} = params;
  if (!locationId) {
    throw new Error('Missing scheduleHandle param');
  }

  const {payload: products} =
    await getBookingShopifyApi().customerLocationGetProducts(
      customerId,
      locationId,
    );

  const productIds = products.map(({productId}) => productId);

  const data = await context.storefront.query<{
    products: ProductConnection;
  }>(ALL_PRODUCTS_QUERY, {
    variables: {
      first: productIds.length,
      query: productIds.length > 0 ? productIds.join(' OR ') : 'id=-',
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    cache: CacheLong(),
  });

  return json({
    storeProducts: data.products,
    customerProducts: products,
  });
}

export default function AccountLocationsEdit() {
  const {storeProducts, customerProducts} = useLoaderData<typeof loader>();

  if (storeProducts.nodes.length === 0) {
    return (
      <Flex
        gap="lg"
        direction="column"
        justify="center"
        align="center"
        mih="100%"
      >
        <ThemeIcon variant="white" size={rem(100)}>
          <IconMoodSad stroke={1} style={{width: '100%', height: '100%'}} />
        </ThemeIcon>
        <Title ta="center" order={2} data-testid="empty-title">
          Du har ingen ydelser tilknyttet dette lokation
        </Title>
        <Button
          component={Link}
          to="/account/services/create"
          data-testid="empty-create-button"
          leftSection={<IconPlus size={14} />}
        >
          Tilføj ydelse
        </Button>
      </Flex>
    );
  }

  return (
    <Grid align="stretch">
      {storeProducts.nodes.map((product) => {
        const customerProduct = customerProducts.find(({productId}) => {
          return productId.toString() === parseGid(product.id).id;
        });

        return (
          <Grid.Col key={product.id} span={{base: 12, md: 6, lg: 4}}>
            <Card
              padding="sm"
              radius="md"
              h="100%"
              withBorder
              component={Link}
              to={`/account/services/${parseGid(product.id).id}`}
            >
              <Flex justify="space-between">
                <Group gap="sm" align="flex-start">
                  {product.featuredImage && (
                    <Image
                      component={ShopifyImage}
                      data={product.featuredImage}
                      h="auto"
                      loading="lazy"
                      style={{width: '32px'}}
                      radius="md"
                    />
                  )}

                  <Title order={3} fw="600" lineClamp={1} style={{flex: 1}}>
                    {product.title}
                  </Title>
                </Group>
              </Flex>

              <Card.Section my="xs">
                <Divider />
              </Card.Section>

              <Flex gap="xl">
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
            </Card>
          </Grid.Col>
        );
      })}
    </Grid>
  );
}
