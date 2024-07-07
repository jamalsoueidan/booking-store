import {ActionIcon, Affix, Box, Divider, Flex, rem} from '@mantine/core';
import {Link, Outlet} from '@remix-run/react';
import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconX} from '@tabler/icons-react';
import {type PropsWithChildren} from 'react';

import {useTranslation} from 'react-i18next';
import {Logo} from '~/components/Logo';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';

export async function loader({context}: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  const {data, errors} = await context.customerAccount.query(
    CUSTOMER_DETAILS_QUERY,
  );

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  if (data.customer.tags.includes('business')) {
    return redirect('/business');
  }

  return json({});
}

export default function AccountBusiness() {
  const {t} = useTranslation(['account', 'global']);

  return (
    <Box
      style={{zIndex: 200}}
      bg="#fff"
      pos="absolute"
      top="0"
      left="0"
      right="0"
      bottom="0"
    >
      <Affix position={{top: 0, left: 0, right: 0}}>
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
      </Affix>

      <Outlet />
    </Box>
  );
}

export function ControlDetails({children}: PropsWithChildren) {
  return (
    <Affix w="100%" bg="white">
      <Divider size="xs" />
      <Box p="md">
        <Flex justify="space-between" align="center">
          <div></div>
          {children}
        </Flex>
      </Box>
    </Affix>
  );
}
