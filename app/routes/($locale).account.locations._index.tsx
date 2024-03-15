import {Card, Grid, Group} from '@mantine/core';
import {useLoaderData} from '@remix-run/react';

import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconPlus} from '@tabler/icons-react';
import {AccountLocation} from '~/components/AccountLocation';
import {AccountButton} from '~/components/account/AccountButton';
import {AccountContent} from '~/components/account/AccountContent';
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
        <Group>
          <AccountButton to={'create'} leftSection={<IconPlus size={14} />}>
            Opret lokation
          </AccountButton>
        </Group>
      </AccountTitle>

      <AccountContent>
        <Grid align="stretch">
          {loaderData.map((d) => (
            <Grid.Col key={d._id} span={{base: 12, md: 6, lg: 4}}>
              <Card padding="sm" radius="md" h="100%" withBorder>
                <AccountLocation data={d} />
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </AccountContent>
    </>
  );
}
