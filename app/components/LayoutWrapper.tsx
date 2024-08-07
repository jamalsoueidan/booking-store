import {
  ActionIcon,
  AppShell,
  Burger,
  Button,
  Flex,
  Group,
  NavLink as NavLinkMantine,
} from '@mantine/core';
import {
  useDisclosure,
  useHeadroom,
  useMediaQuery,
  useWindowScroll,
} from '@mantine/hooks';
import {
  Await,
  Link,
  NavLink,
  useLoaderData,
  useLocation,
} from '@remix-run/react';
import {useAnalytics} from '@shopify/hydrogen';
import {
  IconChevronRight,
  IconDashboard,
  IconKey,
  IconLogin,
  IconShoppingCartPlus,
} from '@tabler/icons-react';
import {Suspense, type ReactNode} from 'react';
import {useTranslation} from 'react-i18next';
import {type loader} from '~/root';
import {Footer} from './Footer';
import {Logo} from './Logo';

export function LayoutWrapper({children}: {children: ReactNode}) {
  const data = useLoaderData<typeof loader>();
  const [opened, {toggle, close}] = useDisclosure();
  const pinned = useHeadroom({fixedAt: 120});
  const [scroll] = useWindowScroll();
  const isMobile = useMediaQuery('(max-width: 62em)');
  const location = useLocation();
  const path = location.pathname;

  const {publish, cart: analyticsCart} = useAnalytics();
  // Example: publishing a custom event when the side cart is toggled
  function publishSideCartViewed() {
    publish('custom_click_menu', {cart: analyticsCart});
  }

  return (
    <AppShell
      header={{
        height: 70,
        collapsed: !pinned && !isMobile,
        offset: opened,
      }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: {desktop: true, mobile: !opened},
      }}
      withBorder={false}
    >
      <AppShell.Header
        component={Flex}
        p="md"
        bg={scroll.y === 0 ? 'transparent' : 'white'}
      >
        {path.includes('/treatments') ? (
          <div
            style={{
              backgroundColor: '#fff',
              position: 'absolute',
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              opacity: '.8',
              zIndex: -1,
            }}
          ></div>
        ) : null}
        <Group h="100%" miw="150px">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Logo close={close} />
        </Group>
        <Flex
          justify="center"
          align="center"
          visibleFrom="sm"
          style={{flex: 1}}
          h="100%"
        >
          {data &&
            data.header &&
            data.header.menu?.items.map(({url, title}) => {
              const newURL = new URL(url || '').pathname
                .replace('/en/', '/')
                .replace('/ar/', '/');
              return (
                <NavLink
                  key={newURL}
                  to={newURL}
                  onClick={publishSideCartViewed}
                >
                  {({isActive}) => (
                    <Button
                      radius="xl"
                      fz="md"
                      fw="500"
                      variant={
                        newURL.includes('start-din-sko')
                          ? 'filled'
                          : 'transparent'
                      }
                      color={
                        newURL.includes('start-din-sko') ? '#8a60f6' : 'black'
                      }
                    >
                      {title}
                    </Button>
                  )}
                </NavLink>
              );
            })}
        </Flex>
        <AuthSection />
      </AppShell.Header>

      <AppShell.Navbar px={4}>
        <MobilNavbar toggle={toggle} />
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
        <Suspense>
          <Await resolve={data.footer}>
            {(footer) => <Footer menu={footer.menu} shop={data.header.shop} />}
          </Await>
        </Suspense>
      </AppShell.Main>
    </AppShell>
  );
}

function AuthSection() {
  const data = useLoaderData<typeof loader>();
  const {t} = useTranslation(['global']);

  return (
    <Flex
      justify="flex-end"
      align="center"
      gap="sm"
      visibleFrom="sm"
      miw="150px"
    >
      <Suspense>
        <Await resolve={data.isLoggedIn}>
          {(isLoggedIn) =>
            isLoggedIn ? (
              <Button
                variant="outline"
                size="sm"
                color="black"
                component={Link}
                to="/account"
                data-testid="login-button"
                rightSection={<IconKey />}
              >
                {t('my_account', {ns: 'global'})}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                color="black"
                component={Link}
                to="/account"
                data-testid="login-button"
              >
                {t('login', {ns: 'global'})}
              </Button>
            )
          }
        </Await>
      </Suspense>
      <Suspense>
        <Await resolve={data.cart}>
          {(cart) =>
            cart?.totalQuantity && cart?.totalQuantity > 0 ? (
              <ActionIcon
                variant="outline"
                size="lg"
                color="black"
                component={Link}
                to="/cart"
                data-testid="cart-button"
              >
                <IconShoppingCartPlus />
              </ActionIcon>
            ) : null
          }
        </Await>
      </Suspense>
    </Flex>
  );
}

function MobilNavbar({toggle}: {toggle: () => void}) {
  const data = useLoaderData<typeof loader>();
  const {t} = useTranslation('global');

  return (
    <>
      {data.header.menu?.items.map(({url, title}) => (
        <NavLinkMantine
          component={NavLink}
          key={url}
          to={new URL(url || '').pathname
            .replace('/en/', '/')
            .replace('/ar/', '/')}
          onClick={toggle}
          label={title}
          rightSection={
            <IconChevronRight
              size="0.8rem"
              stroke={1.5}
              className="mantine-rotate-rtl"
            />
          }
        />
      ))}
      <Flex gap="xs" p="xs">
        <Suspense>
          <Await resolve={data.isLoggedIn}>
            {(isLoggedIn) => (
              <Button
                variant="outline"
                size="compact-lg"
                color="black"
                component={Link}
                to="/account"
                data-testid="nav-login-button"
                rightSection={isLoggedIn ? <IconDashboard /> : <IconLogin />}
                fullWidth
              >
                {isLoggedIn ? 'Dashboard' : t('login', {ns: 'global'})}
              </Button>
            )}
          </Await>
        </Suspense>
        <Suspense>
          <Await resolve={data.cart}>
            {(cart) =>
              cart?.totalQuantity && cart?.totalQuantity > 0 ? (
                <Button
                  variant="outline"
                  size="compact-lg"
                  color="black"
                  component={Link}
                  to="/cart"
                  onClick={toggle}
                  data-testid="nav-cart-button"
                  rightSection={<IconShoppingCartPlus />}
                  fullWidth
                >
                  {t('cart')} {cart.totalQuantity}
                </Button>
              ) : null
            }
          </Await>
        </Suspense>
      </Flex>
    </>
  );
}
