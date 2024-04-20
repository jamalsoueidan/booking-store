import {Button, Flex, rem, ThemeIcon, Title} from '@mantine/core';
import {Link, Outlet, useLoaderData, useOutletContext} from '@remix-run/react';

import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconClock, IconLocation} from '@tabler/icons-react';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';

export function shouldRevalidate() {
  return false;
}

export async function loader({request, context}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});
  const {payload: status} = await getBookingShopifyApi().customerStatus(
    customerId,
  );

  return json({
    status,
  });
}

export default function AccountServices() {
  const {status} = useLoaderData<typeof loader>();
  const context = useOutletContext();

  if (!status.locations) {
    return (
      <>
        <AccountTitle heading="Ydelser"></AccountTitle>
        <AccountContent>
          <Flex gap="lg" direction="column" justify="center" align="center">
            <ThemeIcon variant="white" size={rem(100)}>
              <IconLocation
                stroke={1}
                style={{width: '100%', height: '100%'}}
              />
            </ThemeIcon>
            <Title ta="center" order={2} data-testid="empty-title">
              Du mangler tilføje en lokation inden du kan tilføje ydelser
            </Title>
            <Button
              component={Link}
              to="/account/locations/create"
              data-testid="empty-create-button"
            >
              Tilføj location
            </Button>
          </Flex>
        </AccountContent>
      </>
    );
  }

  if (!status.schedules) {
    return (
      <>
        <AccountTitle heading="Ydelser"></AccountTitle>
        <AccountContent>
          <Flex gap="lg" direction="column" justify="center" align="center">
            <ThemeIcon variant="white" size={rem(100)}>
              <IconClock stroke={1} style={{width: '100%', height: '100%'}} />
            </ThemeIcon>
            <Title ta="center" order={2} data-testid="empty-title">
              Du mangler tilføje en vagtplan inden du kan tilføje ydelser
            </Title>
            <Button
              component={Link}
              to="/account/schedules#create"
              data-testid="empty-create-button"
            >
              Tilføj vagtplan
            </Button>
          </Flex>
        </AccountContent>
      </>
    );
  }

  return <Outlet context={context} />;
}
