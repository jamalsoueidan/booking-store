import {
  ActionIcon,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  rem,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {Link, useLoaderData, useOutletContext} from '@remix-run/react';
import {Money} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconEye, IconMoodSad, IconPlus} from '@tabler/icons-react';
import {AccountButton} from '~/components/account/AccountButton';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {durationToTime} from '~/lib/duration';
import {getCustomer} from '~/lib/get-customer';

export async function loader({context}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});
  const response = await getBookingShopifyApi().customerProductsList(
    customerId,
  );

  return json(response.payload);
}

export default function AccountServicesIndex() {
  const products = useLoaderData<typeof loader>();
  const {user} = useOutletContext<any>();

  return (
    <Container size="md" my={{base: rem(80), sm: rem(100)}}>
      <AccountTitle linkBack="/business" heading="Ydelser">
        <AccountButton
          to={'create'}
          leftSection={<IconPlus size={14} />}
          data-testid="create-button"
        >
          Tilføj ydelse
        </AccountButton>
      </AccountTitle>

      <AccountContent>
        {products.length === 0 ? (
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
              Du har ingen ydelser
            </Title>
            <Button
              component={Link}
              to="create"
              data-testid="empty-create-button"
              leftSection={<IconPlus size={14} />}
            >
              Tilføj ydelse
            </Button>
          </Flex>
        ) : (
          <Grid align="stretch">
            {products.map((product) => {
              return (
                <Grid.Col key={product.productId} span={{base: 12, md: 6}}>
                  <Card
                    padding="sm"
                    radius="md"
                    h="100%"
                    withBorder
                    component={Link}
                    to={`${product.productId}`}
                  >
                    <Flex justify="space-between">
                      <Group gap="sm" align="flex-start">
                        <Title
                          order={3}
                          fw="600"
                          lineClamp={1}
                          style={{flex: 1}}
                        >
                          {product.title}
                        </Title>
                      </Group>
                      <ActionIcon
                        variant="default"
                        aria-label="See live"
                        component={Link}
                        to={`/book/${product.productHandle}`}
                        target="_blank"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <IconEye
                          style={{width: '70%', height: '70%'}}
                          stroke={1.5}
                        />
                      </ActionIcon>
                    </Flex>

                    <Card.Section my="xs">
                      <Divider />
                    </Card.Section>

                    <Grid gutter="sm" columns={2}>
                      <GridCol span={1}>
                        <Text size="sm">Pris</Text>
                        <Text fw={600} size="sm">
                          <Money
                            withoutTrailingZeros
                            data={product?.price as any}
                            as="span"
                          />
                        </Text>
                      </GridCol>
                      <GridCol span={1}>
                        <Text size="sm">Tid</Text>
                        <Text fw={600} size="sm">
                          {durationToTime(product.duration ?? 0)}
                        </Text>
                      </GridCol>
                      <GridCol span={1}>
                        <Text size="sm">Varianter</Text>
                        <Text fw={600} size="sm">
                          {product.options.length} antal
                        </Text>
                      </GridCol>
                      <GridCol span={1}>
                        <Text size="sm">Lokationer</Text>
                        <Text fw={600} size="sm">
                          {product.locations.length} antal
                        </Text>
                      </GridCol>
                      <GridCol span={1}>
                        <Text size="sm">Vagtplan</Text>
                        <Text fw={600} size="sm">
                          {product.scheduleName}
                        </Text>
                      </GridCol>
                    </Grid>
                  </Card>
                </Grid.Col>
              );
            })}
          </Grid>
        )}
      </AccountContent>
    </Container>
  );
}
