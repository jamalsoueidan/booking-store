import {Button, Card, Grid, Group, SimpleGrid} from '@mantine/core';
import {Form, Link, useLoaderData} from '@remix-run/react';

import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {AccountLocation} from '~/components/AccountLocation';
import {AccountTitle} from '~/components/account/AccountTitle';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';

export async function loader({context}: LoaderFunctionArgs) {
  const customer = await getCustomer({context});
  const response = await getBookingShopifyApi().customerLocationList(
    customer.id,
  );

  return json(response.payload);
}

export default function AccountLocationsIndex() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <>
      <AccountTitle heading="Lokationer">
        <Group mt="md">
          <Button component={Link} to={'create'} radius="xl" size="sm">
            Opret lokation
          </Button>
          <Button component={Link} to={'add'} radius="xl" size="sm">
            Tilføj eksisterende
          </Button>
        </Group>
      </AccountTitle>

      <Grid align="stretch">
        {loaderData.map((d) => (
          <Grid.Col key={d._id} span={{base: 12, md: 6, lg: 4}}>
            <Card padding="sm" radius="md" h="100%" withBorder>
              <AccountLocation data={d} />
              <SimpleGrid cols={2} verticalSpacing="xs" mt="lg">
                <Button
                  component={Link}
                  variant="primary"
                  size="xs"
                  to={`${d._id}/edit`}
                >
                  Redigere
                </Button>

                <Form
                  method="post"
                  action={`${d._id}/destroy`}
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
              </SimpleGrid>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </>
  );
}
