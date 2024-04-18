import {
  AppShell,
  Burger,
  Button,
  Flex,
  Group,
  Image,
  MantineProvider,
  NavLink as NavLinkMantine,
  rem,
  Title,
  UnstyledButton,
} from '@mantine/core';
import {ModalsProvider} from '@mantine/modals';

import {
  useDisclosure,
  useHeadroom,
  useMediaQuery,
  useWindowScroll,
} from '@mantine/hooks';
import {NavigationProgress, nprogress} from '@mantine/nprogress';
import {
  Await,
  Link,
  NavLink,
  useLoaderData,
  useLocation,
  useNavigation,
} from '@remix-run/react';
import {
  IconChevronRight,
  IconDashboard,
  IconLogin,
  IconShoppingCartPlus,
} from '@tabler/icons-react';
import {Suspense, useEffect, type ReactNode} from 'react';
import notify, {Toaster} from 'react-hot-toast';
import {type loader} from '~/root';
import {Footer} from './Footer';
import logo from '/Artboard4.svg';

export function LayoutWrapper({children}: {children: ReactNode}) {
  const data = useLoaderData<typeof loader>();
  const [opened, {toggle, close}] = useDisclosure();
  const pinned = useHeadroom({fixedAt: 120});
  const [scroll] = useWindowScroll();
  const isMobile = useMediaQuery('(max-width: 62em)');
  const location = useLocation();
  const path = location.pathname;
  const {state} = useNavigation();

  useEffect(() => {
    if (state === 'loading' || state === 'submitting') {
      nprogress.start();
    } else {
      nprogress.complete();
    }
  }, [state]);

  useEffect(() => {
    if (data && data.toast) {
      switch (data.toast.type) {
        case 'success':
          notify.success(data.toast.message);
          return;
        case 'error':
          notify.error(data.toast.message);
          return;
        default:
          return;
      }
    }
  }, [data]);

  return (
    <MantineProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <NavigationProgress />
      <ModalsProvider>
        {!path.includes('/account') && !path.includes('/artist/') ? (
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
              <Group h="100%" miw="150px">
                <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="sm"
                  size="sm"
                />
                <UnstyledButton component={Link} to="/" onClick={close}>
                  <Title
                    order={1}
                    component={Flex}
                    lh="xs"
                    fz={rem(28)}
                    fw="500"
                    data-testid="logo-login"
                  >
                    ByS
                    <Image src={logo} alt="it's me" h="auto" w="8px" mx="2px" />
                    sters
                  </Title>
                </UnstyledButton>
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
                  data.header.menu?.items.map(({url, title}) => (
                    <NavLink key={url} to={new URL(url || '').pathname}>
                      {({isActive}) => (
                        <Button
                          radius="xl"
                          fz="md"
                          fw="500"
                          variant={
                            title.includes('skønhedskarriere')
                              ? 'filled'
                              : 'transparent'
                          }
                          color={
                            title.includes('skønhedskarriere')
                              ? '#8a60f6'
                              : 'black'
                          }
                        >
                          {title}
                        </Button>
                      )}
                    </NavLink>
                  ))}
              </Flex>
              <Flex
                justify="flex-end"
                align="center"
                gap="sm"
                visibleFrom="sm"
                miw="150px"
              >
                <Suspense>
                  <Await resolve={data.isLoggedIn}>
                    {(isLoggedIn) => (
                      <Button
                        variant="outline"
                        size="compact-md"
                        color="black"
                        component={Link}
                        to="/account"
                        data-testid="login-button"
                        rightSection={
                          isLoggedIn ? <IconDashboard /> : <IconLogin />
                        }
                      >
                        {isLoggedIn ? 'Dashboard' : 'Log ind'}
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
                          size="compact-md"
                          color="black"
                          component={Link}
                          to="/cart"
                          data-testid="cart-button"
                          rightSection={<IconShoppingCartPlus />}
                        >
                          Indkøbskurv {cart.totalQuantity}
                        </Button>
                      ) : null
                    }
                  </Await>
                </Suspense>
              </Flex>
            </AppShell.Header>

            <AppShell.Navbar px={4}>
              {data.header.menu?.items.map(({url, title}) => (
                <NavLinkMantine
                  component={NavLink}
                  key={url}
                  to={new URL(url || '').pathname}
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
                        rightSection={
                          isLoggedIn ? <IconDashboard /> : <IconLogin />
                        }
                        fullWidth
                      >
                        {isLoggedIn ? 'Dashboard' : 'Log ind'}
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
                          Indkøbskurv {cart.totalQuantity}
                        </Button>
                      ) : null
                    }
                  </Await>
                </Suspense>
              </Flex>
            </AppShell.Navbar>

            <AppShell.Main>
              {children}
              <Suspense>
                <Await resolve={data.footer}>
                  {(footer) => (
                    <Footer menu={footer.menu} shop={data.header.shop} />
                  )}
                </Await>
              </Suspense>
            </AppShell.Main>
          </AppShell>
        ) : (
          <>{children}</>
        )}
      </ModalsProvider>
    </MantineProvider>
  );
}
