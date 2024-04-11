import {AppShell, Flex, Text, UnstyledButton} from '@mantine/core';
import {useDisclosure, useMediaQuery} from '@mantine/hooks';
import {Link, Outlet, useLoaderData} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  IconAddressBook,
  IconCalendarEvent,
  IconClock,
  IconHome,
  IconMenu2,
  IconShoppingBag,
  IconUser,
} from '@tabler/icons-react';
import {type CustomerQuery} from 'storefrontapi.generated';
import {AccountMenu} from '~/components/AccountMenu';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type User} from '~/lib/api/model';

export type AccountOutlet = {
  customer: CustomerQuery['customer'];
  user?: User | null;
  isBusiness: boolean;
};

export async function loader({request, context}: LoaderFunctionArgs) {
  const {session, storefront} = context;
  const {pathname} = new URL(request.url);
  const customerAccessToken = await session.get('customerAccessToken');
  const isLoggedIn = !!customerAccessToken?.accessToken;
  const isAccountHome = pathname === '/account' || pathname === '/account/';
  const isPrivateRoute =
    /^\/account\/(payouts|orders|business|profile|dashboard|addresses|upload|public|booked|bookings|password|locations|services|schedules)(\/.*)?$/.test(
      pathname,
    );

  if (!isLoggedIn) {
    if (isPrivateRoute || isAccountHome) {
      session.unset('customerAccessToken');
      return redirect('/account/login', {
        headers: {
          'Set-Cookie': await session.commit(),
        },
      });
    } else {
      // public subroute such as /account/login...
      return json({
        isLoggedIn: false,
        isAccountHome,
        isPrivateRoute,
        customer: null,
        user: null,
        isBusiness: null,
      });
    }
  } else {
    // loggedIn, default redirect to the orders page
    if (isAccountHome) {
      return redirect('/account/dashboard');
    }
  }

  try {
    const {customer} = await storefront.query(CUSTOMER_QUERY, {
      variables: {
        customerAccessToken: customerAccessToken.accessToken,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
      cache: storefront.CacheNone(),
    });

    if (!customer) {
      throw new Response('Customer not found', {status: 404});
    }

    const {payload: userIsBusiness} =
      await getBookingShopifyApi().customerIsBusiness(parseGid(customer.id).id);

    let user = undefined;
    if (userIsBusiness.isBusiness) {
      user = (
        await getBookingShopifyApi().customerGet(parseGid(customer.id).id)
      ).payload;
    }

    return json(
      {
        isLoggedIn,
        isPrivateRoute,
        isAccountHome,
        customer,
        isBusiness: userIsBusiness.isBusiness,
        user,
      },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      },
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('There was a problem loading account', error);
    session.unset('customerAccessToken');
    return redirect('/account/login', {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    });
  }
}

export default function Acccount() {
  const {customer, user, isBusiness, isPrivateRoute, isAccountHome} =
    useLoaderData<typeof loader>();

  if (!isPrivateRoute && !isAccountHome) {
    return <Outlet context={{customer}} />;
  }

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
} & AccountOutlet) {
  const [opened, {toggle, close}] = useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 48em)');

  return (
    <AppShell
      navbar={{width: 300, breakpoint: 'sm', collapsed: {mobile: !opened}}}
      footer={{height: 84, collapsed: !isMobile || opened}}
    >
      <AppShell.Navbar bg="gray.1">
        <AccountMenu closeDrawer={close} opened={opened} {...props} />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>

      <AppShell.Footer
        py="sm"
        style={{filter: 'drop-shadow(0 5mm 6mm rgb(0, 0, 0))'}}
      >
        <Flex gap="xs" w="100%">
          <UnstyledButton component={Link} to="/account/" style={{flex: 1}}>
            <Flex direction="column" gap="sm" justify="center" align="center">
              <IconHome />
              <Text>Hjem</Text>
            </Flex>
          </UnstyledButton>
          {props.user ? (
            <>
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
                  <Text>Vagtplan</Text>
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
                  <Text>Ydelser</Text>
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
                  <Text>Kalendar</Text>
                </Flex>
              </UnstyledButton>
            </>
          ) : (
            <>
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
                  <Text>Købshistorik</Text>
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
                  <Text>Konto</Text>
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
                  <Text>Adresser</Text>
                </Flex>
              </UnstyledButton>
            </>
          )}
          <UnstyledButton onClick={toggle} style={{flex: 1}}>
            <Flex direction="column" gap="sm" justify="center" align="center">
              <IconMenu2 />
              <Text>Menu</Text>
            </Flex>
          </UnstyledButton>
        </Flex>
      </AppShell.Footer>
    </AppShell>
  );
}

export const CUSTOMER_FRAGMENT = `#graphql
  fragment Customer on Customer {
    id
    acceptsMarketing
    addresses(first: 6) {
      nodes {
        ...Address
      }
    }
    defaultAddress {
      ...Address
    }
    email
    firstName
    lastName
    numberOfOrders
    phone
  }
  fragment Address on MailingAddress {
    id
    formatted
    firstName
    lastName
    company
    address1
    address2
    country
    province
    city
    zip
    phone
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/customer
export const CUSTOMER_QUERY = `#graphql
  query Customer(
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      ...Customer
    }
  }
  ${CUSTOMER_FRAGMENT}
` as const;
