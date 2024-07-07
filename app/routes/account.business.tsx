import {ActionIcon, Flex, rem} from '@mantine/core';
import {Link, Outlet} from '@remix-run/react';
import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconX} from '@tabler/icons-react';

import {Logo} from '~/components/Logo';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';

export async function loader({context}: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  const {data} = await context.customerAccount.query(CUSTOMER_DETAILS_QUERY);

  if (data.customer.tags.includes('business')) {
    return redirect('/business');
  }

  return json({});
}

export default function AccountBusiness() {
  return (
    <Flex direction="column" mih="100vh">
      <Flex h={60} bg="white" justify="space-between" align="center" p="sm">
        <Logo close={() => {}} />

        <ActionIcon
          variant="transparent"
          c="black"
          component={Link}
          to={`/account`}
        >
          <IconX style={{width: rem(36), height: rem(36), strokeWidth: 1}} />
        </ActionIcon>
      </Flex>

      <Outlet />
    </Flex>
  );
}
