import {Anchor, Button, Stack} from '@mantine/core';
import {Link, Outlet, useLoaderData, useOutletContext} from '@remix-run/react';

import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';

export function shouldRevalidate() {
  return false;
}

export async function loader({context}: LoaderFunctionArgs) {
  const customer = await getCustomer({context});
  const response = await getBookingShopifyApi().customerStatus(customer.id);

  return json({
    status: response.payload,
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
          <Stack>
            Du mangler tilføje{' '}
            <Anchor display="contents" component={Link} to="/account/locations">
              lokationer
            </Anchor>
            <div>
              <Button component={Link} to="/account/locations">
                Gå til lokationer
              </Button>
            </div>
          </Stack>
        </AccountContent>
      </>
    );
  }
  if (!status.schedules) {
    return (
      <>
        <AccountTitle heading="Ydelser"></AccountTitle>
        <AccountContent>
          <Stack>
            Tilføj{' '}
            <Anchor display="contents" component={Link} to="/account/schedules">
              vagtplan
            </Anchor>{' '}
            inden du tilføjer ydelser
            <div>
              <Button component={Link} to="/account/schedules">
                Gå til vagtplaner
              </Button>
            </div>
          </Stack>
        </AccountContent>
      </>
    );
  }
  return <Outlet context={context} />;
}
