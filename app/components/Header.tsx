import {
  ActionIcon,
  Box,
  Burger,
  Center,
  Divider,
  Drawer,
  Flex,
  Group,
  Menu,
  ScrollArea,
  rem,
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {Await, Link, NavLink, useLocation} from '@remix-run/react';
import {
  IconChevronDown,
  IconLogin,
  IconShoppingCart,
  IconShoppingCartPlus,
  IconUser,
} from '@tabler/icons-react';
import React, {Suspense} from 'react';
import type {HeaderQuery} from 'storefrontapi.generated';
import {useRootLoaderData} from '~/root';
import logo from '../../public/logo.avif';
import classes from './Header.module.css';
import type {LayoutProps} from './Layout';

type HeaderProps = Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>;

type Viewport = 'desktop' | 'mobile';

export function Header({header, isLoggedIn, cart}: HeaderProps) {
  const {shop, menu} = header;
  const [drawerOpened, {toggle: toggleDrawer, close: closeDrawer}] =
    useDisclosure(false);

  return (
    <Box>
      <header className={classes.header}>
        <Flex h="100%" align="center" justify="space-between">
          <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
            <img
              src={logo}
              alt={shop.name}
              width="150"
              style={{paddingTop: '6px'}}
            />
          </NavLink>
          <Group h="100%" w="100%" gap={0} visibleFrom="md" justify="center">
            <HeaderMenu
              menu={menu}
              viewport="desktop"
              primaryDomainUrl={header.shop.primaryDomain.url}
            />
          </Group>
          <Group visibleFrom="md">
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
              ? new URL(item.url).pathname
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
                  className={classes.link}
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
            className={classes.link}
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
      <ActionIcon.Group>
        <ActionIcon
          variant="default"
          size="lg"
          aria-label="Account"
          component={Link}
          to="/account"
          prefetch="intent"
        >
          {isLoggedIn ? (
            <IconUser style={{width: rem(24)}} stroke={1.5} />
          ) : (
            <IconLogin style={{width: rem(24)}} stroke={1.5} />
          )}
        </ActionIcon>

        <CartToggle cart={cart} />
      </ActionIcon.Group>
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
      title="Navigation"
      hiddenFrom="md"
      zIndex={1000000}
    >
      <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
        <Divider mb="sm" />

        <Link
          to="/"
          onClick={closeDrawer}
          className={classes.link}
          data-active={location.pathname === '/' || undefined}
        >
          Hjem
        </Link>

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
            <Link
              key={link.id}
              to={url}
              onClick={closeDrawer}
              className={classes.link}
              data-active={location?.pathname.includes(url) || undefined}
            >
              {link.title}
            </Link>
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

function SearchToggle() {
  return <a href="#search-aside">Search</a>;
}

function CartBadge({count}: {count: number}) {
  return (
    <ActionIcon
      variant="default"
      size="lg"
      aria-label="Cart"
      component="a"
      href="#cart-aside"
    >
      {count > 0 ? (
        <IconShoppingCartPlus style={{width: rem(24)}} stroke={1.5} />
      ) : (
        <IconShoppingCart style={{width: rem(24)}} stroke={1.5} />
      )}
    </ActionIcon>
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
