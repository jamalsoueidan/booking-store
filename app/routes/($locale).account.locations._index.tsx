import {
  Button,
  Card,
  Flex,
  Grid,
  Group,
  rem,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {Link, useLoaderData} from '@remix-run/react';

import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconMoodSad, IconPlus} from '@tabler/icons-react';
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
        {loaderData.length === 0 ? (
          <Flex gap="lg" direction="column" justify="center" align="center">
            <ThemeIcon variant="white" size={rem(100)}>
              <IconMoodSad stroke={1} style={{width: '100%', height: '100%'}} />
            </ThemeIcon>
            <Title ta="center">Du har ingen lokationer</Title>
            <Button component={Link} to="create">
              Opret lokation
            </Button>
          </Flex>
        ) : null}

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
