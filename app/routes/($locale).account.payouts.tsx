import {Group} from '@mantine/core';
import {Outlet} from '@remix-run/react';

import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {AccountButton} from '~/components/account/AccountButton';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {getCustomer} from '~/lib/get-customer';

export async function loader({context}: LoaderFunctionArgs) {
  const customer = await getCustomer({context});
  return json({});
}

export default function AccountPayouts() {
  return (
    <>
      <AccountTitle heading="Udbetalinger">
        <Group>
          <AccountButton to={'.'}>Udbetalinger</AccountButton>
          <AccountButton to={'settings'}>Indstillinger</AccountButton>
        </Group>
      </AccountTitle>

      <AccountContent>
        <Outlet />
      </AccountContent>
    </>
  );
}
