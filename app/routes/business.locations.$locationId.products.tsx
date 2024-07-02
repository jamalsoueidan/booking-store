import {Link, useLoaderData} from '@remix-run/react';

import {
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Group,
  rem,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {Money} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconMoodSad, IconPlus} from '@tabler/icons-react';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {durationToTime} from '~/lib/duration';
import {getCustomer} from '~/lib/get-customer';

export async function loader({context, params}: LoaderFunctionArgs) {
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

  return json({
    products,
  });
}

export default function AccountLocationsEdit() {
  const {products} = useLoaderData<typeof loader>();

  if (products.length === 0) {
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
          to="/business/services/create"
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
      {products.map((product) => {
        return (
          <Grid.Col key={product.productId} span={{base: 12, md: 6, lg: 4}}>
            <Card
              padding="sm"
              radius="md"
              h="100%"
              withBorder
              component={Link}
              to={`/business/services/${product.productId}`}
            >
              <Flex justify="space-between">
                <Group gap="sm" align="flex-start">
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
                    {durationToTime(product?.duration ?? 0)}
                  </Text>
                </div>
                <div style={{flex: 1}}>
                  <Text size="sm">Pris</Text>
                  <Text fw={600} size="sm">
                    <Money
                      withoutTrailingZeros
                      data={product?.price as any}
                      as="span"
                    />
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
