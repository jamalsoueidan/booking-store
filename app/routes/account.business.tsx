import {ActionIcon, Box, Flex, rem} from '@mantine/core';
import {Link, Outlet} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconX} from '@tabler/icons-react';
import {type PropsWithChildren} from 'react';

import {Logo} from '~/components/Logo';

const HEIGHT = 70;

export async function loader({context}: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  return json(null);
}

export default function AccountBusiness() {
  return (
    <>
      <Flex
        justify="space-between"
        align="center"
        pos="absolute"
        top="0"
        left="0"
        right="0"
        h={HEIGHT}
        p="md"
        bg="white"
      >
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
    </>
  );
}

export function WrapSection({children}: PropsWithChildren) {
  return (
    <Box mt={HEIGHT} mb={HEIGHT + 10}>
      {children}
    </Box>
  );
}

export function BottomSection({children}: PropsWithChildren) {
  return (
    <Flex
      justify="flex-end"
      align="center"
      pos="fixed"
      left="0"
      right="0"
      bottom="0"
      p="md"
      bg="white"
      h={HEIGHT}
      style={{boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)', zIndex: 10}}
    >
      {children}
    </Flex>
  );
}
