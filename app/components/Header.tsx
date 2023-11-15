import {
  ActionIcon,
  Box,
  Burger,
  Divider,
  Drawer,
  Flex,
  Group,
  ScrollArea,
  rem,
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {Await, Link, NavLink} from '@remix-run/react';
import {
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
        <Flex h="100%" align="center">
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
            style={{position: 'absolute', top: '18px', right: '10px'}}
          />
        </Flex>
      </header>
      <HeaderMenuMobile drawerOpened={drawerOpened} closeDrawer={closeDrawer}>
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
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <a key={item.id} href={url} className={classes.link}>
            {item.title}
          </a>
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
}: {
  children: JSX.Element;
  drawerOpened: boolean;
  closeDrawer: () => void;
}) {
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
        <Divider my="sm" />

        <a href="a" className={classes.link}>
          Home
        </a>

        <a href="b" className={classes.link}>
          Learn
        </a>

        <a href="c" className={classes.link}>
          Academy
        </a>

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
        <IconShoppingCart style={{width: rem(24)}} stroke={1.5} />
      ) : (
        <IconShoppingCartPlus style={{width: rem(24)}} stroke={1.5} />
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
