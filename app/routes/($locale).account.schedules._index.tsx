import {
  Badge,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Group,
  Stack,
  Title,
} from '@mantine/core';
import {Link, useLoaderData} from '@remix-run/react';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';

export async function loader({request, context, params}: LoaderFunctionArgs) {
  const customer = await getCustomer({context});
  const response = await getBookingShopifyApi().customerScheduleList(
    customer.id,
  );

  return response.payload;
}

export default function AccountSchedule() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <>
      <Title>Vagtplaner</Title>
      <Group mt="md">
        <Button component={Link} to={'create'} radius="xl" size="md">
          Opret ny vagtplan
        </Button>
      </Group>
      <Divider my="md" />
      <Grid align="stretch">
        {loaderData.map((d) => (
          <Grid.Col key={d._id} span={{base: 12, md: 6, lg: 4}}>
            <Card padding="sm" radius="md" h="100%" withBorder>
              <Stack gap="xs">
                <Title order={4}>{d.name}</Title>
                <Flex gap="2">
                  {d.slots.map((slot) => {
                    return (
                      <Badge key={slot.day} color="gray">
                        {slot.day}
                      </Badge>
                    );
                  })}
                </Flex>
                <Button component={Link} variant="primary" size="xs" to={d._id}>
                  Redigere
                </Button>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </>
  );
}
