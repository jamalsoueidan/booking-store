import {
  Box,
  Burger,
  Button,
  ButtonGroup,
  Center,
  Divider,
  Drawer,
  Flex,
  Group,
  Image,
  NavLink as MantineNavLink,
  Menu,
  ScrollArea,
  Title,
  UnstyledButton,
  rem,
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {Await, Link, NavLink, useLocation} from '@remix-run/react';
import {
  IconChevronDown,
  IconDashboard,
  IconShoppingCart,
  IconShoppingCartPlus,
  IconUser,
} from '@tabler/icons-react';
import clsx from 'clsx';
import React, {Suspense} from 'react';
import type {HeaderQuery} from 'storefrontapi.generated';
import {useRootLoaderData} from '~/root';
import logo from '../../public/Artboard4.svg';
import classes from './Header.module.css';
import type {LayoutProps} from './Layout';

type HeaderProps = Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>;

type Viewport = 'desktop' | 'mobile';

export function Header({header, isLoggedIn, cart}: HeaderProps) {
  const {shop, menu} = header;
  const [drawerOpened, {toggle: toggleDrawer, close: closeDrawer}] =
    useDisclosure(false);

  return (
    <Box mx={{base: 'md', sm: '42'}} style={{zIndex: 2}}>
      <header className={classes.header}>
        <Flex h="100%" align="center" justify="space-between">
          <UnstyledButton component={Link} to="/" cy-test="logo-button">
            <Title order={1} component={Flex} lh="xs" fw="500">
              ByS
              <Image src={logo} alt="it's me" h="auto" w="10px" mx="2px" />
              sters
            </Title>
          </UnstyledButton>

          <Group h="100%" w="100%" gap={0} visibleFrom="md" justify="center">
            <HeaderMenu
              menu={menu}
              viewport="desktop"
              primaryDomainUrl={header.shop.primaryDomain.url}
            />
          </Group>
          <Group visibleFrom="md" w="150px" justify="flex-end">
            <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
          </Group>
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="md"
          />
        </Flex>
      </header>
      <HeaderMenuMobile
        drawerOpened={drawerOpened}
        closeDrawer={closeDrawer}
        menu={menu}
        primaryDomainUrl={header.shop.primaryDomain.url}
      >
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </HeaderMenuMobile>
    </Box>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
  viewport: Viewport;
}) {
  const location = useLocation();
  const {publicStoreDomain} = useRootLoaderData();
  const className = `header-menu-${viewport}`;

  function closeAside(event: React.MouseEvent<HTMLAnchorElement>) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={closeAside}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Hjem
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((link) => {
        if (!link.url) return null;

        // if the url is internal, we strip the domain
        const url =
          link.url.includes('myshopify.com') ||
          link.url.includes(publicStoreDomain) ||
          link.url.includes(primaryDomainUrl)
            ? new URL(link.url).pathname
            : link.url;

        const menuItems = link.items?.map((item) => {
          if (!item.url) return null;

          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname + new URL(item.url).search
              : link.url;

          return (
            <Menu.Item key={item.url} component={Link} to={url || ''}>
              {item.title}
            </Menu.Item>
          );
        });

        if (menuItems.length > 0) {
          return (
            <Menu
              key={link.id}
              trigger="hover"
              transitionProps={{exitDuration: 0}}
              withinPortal
            >
              <Menu.Target>
                <Link
                  to={url}
                  className={clsx(classes.link, classes.linkLight)}
                  data-active={location.pathname.includes(url) || undefined}
                >
                  <Center>
                    <span className={classes.linkLabel}>{link.title}</span>
                    <IconChevronDown size="0.9rem" stroke={1.5} />
                  </Center>
                </Link>
              </Menu.Target>
              <Menu.Dropdown>{menuItems}</Menu.Dropdown>
            </Menu>
          );
        }

        return (
          <Link
            key={link.id}
            to={url}
            className={clsx(
              classes.link,
              classes.linkLight,
              link.title.toLowerCase() === 'start din skønhedskarriere' &&
                classes.startYourSuccess,
            )}
            data-active={location.pathname.includes(url) || undefined}
          >
            {link.title}
          </Link>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <>
      <ButtonGroup>
        {isLoggedIn ? (
          <Button
            variant="transparent"
            size="xs"
            c="black"
            rightSection={
              <IconDashboard style={{width: rem(18)}} stroke={1.5} />
            }
            aria-label="Account Dashboard"
            component={Link}
            to="/account"
            prefetch="intent"
          >
            Dashboard
          </Button>
        ) : (
          <Button
            variant="transparent"
            size="xs"
            c="black"
            rightSection={<IconUser style={{width: rem(18)}} stroke={1.5} />}
            aria-label="Account Login"
            component={Link}
            to="/account"
            prefetch="intent"
          >
            Login
          </Button>
        )}

        <CartToggle cart={cart} />
      </ButtonGroup>
    </>
  );
}

function HeaderMenuMobile({
  children,
  drawerOpened,
  closeDrawer,
  primaryDomainUrl,
  menu,
}: {
  children: JSX.Element;
  drawerOpened: boolean;
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
  closeDrawer: () => void;
}) {
  const location = useLocation();
  const {publicStoreDomain} = useRootLoaderData();

  return (
    <Drawer
      opened={drawerOpened}
      onClose={closeDrawer}
      size="100%"
      padding="md"
      title="BySisters.dk"
      hiddenFrom="md"
      zIndex={1000000}
    >
      <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
        <Divider mb="sm" />

        <MantineNavLink
          component={Link}
          to="/"
          label={'Hjem'}
          onClick={closeDrawer}
          data-active={location.pathname === '/' || undefined}
        />

        {(menu || FALLBACK_HEADER_MENU).items.map((link) => {
          if (!link.url) return null;

          // if the url is internal, we strip the domain
          const url =
            link.url.includes('myshopify.com') ||
            link.url.includes(publicStoreDomain) ||
            link.url.includes(primaryDomainUrl)
              ? new URL(link.url).pathname
              : link.url;

          return (
            <MantineNavLink
              key={link.id}
              component={Link}
              to={url}
              label={link.title}
              onClick={closeDrawer}
              data-active={location?.pathname.includes(url) || undefined}
            />
          );
        })}

        <Divider my="sm" />

        <Group justify="center" grow pb="xl" px="md">
          {children}
        </Group>
      </ScrollArea>
    </Drawer>
  );
}

function CartBadge({count}: {count: number}) {
  return (
    <Button
      aria-label="Cart"
      variant="transparent"
      size="xs"
      c="black"
      component="a"
      href="#cart-aside"
      rightSection={
        count > 0 ? (
          <IconShoppingCartPlus style={{width: rem(18)}} stroke={1.5} />
        ) : (
          <IconShoppingCart style={{width: rem(18)}} stroke={1.5} />
        )
      }
    >
      Indkøbskurv
    </Button>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          return <CartBadge count={cart.totalQuantity || 0} />;
        }}
      </Await>
    </Suspense>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}
