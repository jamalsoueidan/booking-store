import {AppShell, Flex, Text, UnstyledButton} from '@mantine/core';
import {useDisclosure, useMediaQuery} from '@mantine/hooks';
import {
  Link,
  Outlet,
  type ShouldRevalidateFunction,
  useLoaderData,
} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {
  json,
  type LoaderFunctionArgs,
  type SerializeFrom,
} from '@shopify/remix-oxygen';
import {
  IconAddressBook,
  IconCalendarEvent,
  IconClock,
  IconHome,
  IconLocation,
  IconMenu2,
  IconShoppingBag,
  IconUser,
} from '@tabler/icons-react';
import {type CustomerFragment} from 'customer-accountapi.generated';
import {AccountMenu} from '~/components/AccountMenu';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type User} from '~/lib/api/model';

export type AccountOutlet = {
  customer: CustomerFragment;
  user?: User | null;
  isBusiness: boolean;
};

export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  if (formMethod && formMethod !== 'GET') {
    return true;
  }

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) {
    return true;
  }

  return false;
};

export async function loader({context}: LoaderFunctionArgs) {
  const {data, errors} = await context.customerAccount.query(
    CUSTOMER_DETAILS_QUERY,
  );

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  const {payload: userIsBusiness} =
    await getBookingShopifyApi().customerIsBusiness(
      parseGid(data.customer.id).id,
    );

  let user = undefined;
  if (userIsBusiness.isBusiness) {
    user = (
      await getBookingShopifyApi().customerGet(parseGid(data.customer.id).id)
    ).payload;
  }

  return json(
    {
      customer: data.customer,
      isBusiness: userIsBusiness.isBusiness,
      user,
    },
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Set-Cookie': await context.session.commit(),
      },
    },
  );
}

export default function Acccount() {
  const {customer, user, isBusiness} = useLoaderData<typeof loader>();

  return (
    <AccountLayout
      customer={customer!}
      user={user}
      isBusiness={isBusiness || false}
    >
      <Outlet context={{customer, user, isBusiness}} />
    </AccountLayout>
  );
}

function AccountLayout({
  children,
  ...props
}: {
  children: React.ReactNode;
} & Awaited<SerializeFrom<typeof loader>>) {
  const [opened, {toggle, close}] = useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 48em)');

  return (
    <AppShell
      navbar={{width: 300, breakpoint: 'sm', collapsed: {mobile: !opened}}}
      footer={{height: 84, collapsed: !isMobile || opened}}
    >
      <AppShell.Navbar bg="gray.1">
        <AccountMenu
          closeDrawer={close}
          opened={opened}
          customer={props.customer}
          isBusiness={props.isBusiness}
          user={props.user}
        />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>

      <AppShell.Footer
        py="sm"
        style={{filter: 'drop-shadow(0 5mm 6mm rgb(0, 0, 0))'}}
      >
        <Flex gap="0" w="100%">
          {props.user ? (
            <>
              <UnstyledButton
                component={Link}
                to="/account/locations"
                style={{flex: 1}}
              >
                <Flex
                  direction="column"
                  gap="sm"
                  justify="center"
                  align="center"
                >
                  <IconLocation />
                  <Text fz="sm">Lokationer</Text>
                </Flex>
              </UnstyledButton>
              <UnstyledButton
                component={Link}
                to="/account/schedules"
                style={{flex: 1}}
              >
                <Flex
                  direction="column"
                  gap="sm"
                  justify="center"
                  align="center"
                >
                  <IconClock />
                  <Text fz="sm">Vagtplan</Text>
                </Flex>
              </UnstyledButton>
              <UnstyledButton
                component={Link}
                to="/account/services"
                style={{flex: 1}}
              >
                <Flex
                  direction="column"
                  gap="sm"
                  justify="center"
                  align="center"
                >
                  <IconAddressBook />
                  <Text fz="sm">Ydelser</Text>
                </Flex>
              </UnstyledButton>
              <UnstyledButton
                component={Link}
                to="/account/bookings"
                style={{flex: 1}}
              >
                <Flex
                  direction="column"
                  gap="sm"
                  justify="center"
                  align="center"
                >
                  <IconCalendarEvent />
                  <Text fz="sm">Kalendar</Text>
                </Flex>
              </UnstyledButton>
            </>
          ) : (
            <>
              <UnstyledButton component={Link} to="/account/" style={{flex: 1}}>
                <Flex
                  direction="column"
                  gap="sm"
                  justify="center"
                  align="center"
                >
                  <IconHome />
                  <Text fz="sm">Hjem</Text>
                </Flex>
              </UnstyledButton>
              <UnstyledButton
                component={Link}
                to="/account/orders"
                style={{flex: 1}}
              >
                <Flex
                  direction="column"
                  gap="sm"
                  justify="center"
                  align="center"
                >
                  <IconShoppingBag />
                  <Text fz="sm">Købshistorik</Text>
                </Flex>
              </UnstyledButton>
              <UnstyledButton
                component={Link}
                to="/account/profile"
                style={{flex: 1}}
              >
                <Flex
                  direction="column"
                  gap="sm"
                  justify="center"
                  align="center"
                >
                  <IconUser />
                  <Text fz="sm">Konto</Text>
                </Flex>
              </UnstyledButton>
              <UnstyledButton
                component={Link}
                to="/account/addresses"
                style={{flex: 1}}
              >
                <Flex
                  direction="column"
                  gap="sm"
                  justify="center"
                  align="center"
                >
                  <IconAddressBook />
                  <Text fz="sm">Adresser</Text>
                </Flex>
              </UnstyledButton>
            </>
          )}
          <UnstyledButton onClick={toggle} style={{flex: 0.7}}>
            <Flex direction="column" gap="sm" justify="center" align="center">
              <IconMenu2 />
              <Text fz="sm">Menu</Text>
            </Flex>
          </UnstyledButton>
        </Flex>
      </AppShell.Footer>
    </AppShell>
  );
}
