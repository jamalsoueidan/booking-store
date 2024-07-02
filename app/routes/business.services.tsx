import {Button, Container, Flex, rem, ThemeIcon, Title} from '@mantine/core';
import {Link, Outlet, useLoaderData, useOutletContext} from '@remix-run/react';

import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconClock, IconLocation, IconPlus} from '@tabler/icons-react';
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
      <Container size="md" my={{base: rem(80), sm: rem(100)}}>
        <AccountTitle linkBack="/business" heading="Ydelser"></AccountTitle>
        <AccountContent>
          <Flex gap="lg" direction="column" justify="center" align="center">
            <ThemeIcon variant="white" size={rem(100)}>
              <IconLocation
                stroke={1}
                style={{width: '100%', height: '100%'}}
              />
            </ThemeIcon>
            <Title ta="center" order={2} data-testid="empty-title">
              Du mangler oprette en lokation inden du kan tilføje ydelser
            </Title>
            <Button
              component={Link}
              to="/business/locations/create"
              data-testid="empty-create-button"
              leftSection={<IconPlus size={14} />}
            >
              Opret location
            </Button>
          </Flex>
        </AccountContent>
      </Container>
    );
  }

  if (!status.schedules) {
    return (
      <Container size="md" my={{base: rem(80), sm: rem(100)}}>
        <AccountTitle heading="Ydelser"></AccountTitle>
        <AccountContent>
          <Flex gap="lg" direction="column" justify="center" align="center">
            <ThemeIcon variant="white" size={rem(100)}>
              <IconClock stroke={1} style={{width: '100%', height: '100%'}} />
            </ThemeIcon>
            <Title ta="center" order={2} data-testid="empty-title">
              Du mangler oprette en vagtplan inden du kan tilføje ydelser
            </Title>
            <Button
              component={Link}
              to="/business/schedules#create"
              data-testid="empty-create-button"
            >
              Opret vagtplan
            </Button>
          </Flex>
        </AccountContent>
      </Container>
    );
  }

  return <Outlet context={context} />;
}
